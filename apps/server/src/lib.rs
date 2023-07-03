pub mod db;
pub mod graphql;
mod query;
mod resource;
pub mod server;

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::init;
    use async_graphql::{value, Request, Response, Value, Variables};
    use serde_json::json;
    use sqlx::SqlitePool;
    use std::time::Duration;
    use tokio::time::sleep;

    struct Schema(graphql::GraphQLSchema);

    impl Schema {
        async fn new() -> sqlx::Result<Schema> {
            let pool = SqlitePool::connect("sqlite::memory:").await?;
            init::create_tables(&pool).await?;
            init::foreign_keys(&pool).await?;
            Ok(Schema(graphql::graphql_schema(pool)))
        }
        async fn exec(&self, query: &str, vars: Value) -> Response {
            let req = Request::new(query).variables(Variables::from_value(vars));
            self.0.execute(req).await
        }
    }

    fn obj_get<'a>(obj: &'a serde_json::Value, key: &str) -> &'a serde_json::Value {
        obj.as_object().unwrap().get(key).unwrap()
    }

    #[tokio::test]
    async fn create_book() {
        let schema = Schema::new().await.unwrap();
        let query = r#"mutation {
            createBook(title: "hoge") { title }
        }"#;
        let res = schema.exec(query, value!({})).await;
        assert_eq!(
            res.data,
            value!({
                "createBook": { "title": "hoge" }
            })
        );
    }
    #[tokio::test]
    async fn check_memo_book_id() {
        let schema = Schema::new().await.unwrap();
        fn get_id(res: &Response, key: &str) -> String {
            let data = res.data.clone().into_json().unwrap();
            let id = obj_get(obj_get(&data, key), "id");
            id.as_str().unwrap().to_string()
        }

        let query = r#"mutation {
            hoge: createBook(title: "hoge") { id }
            fuga: createBook(title: "fuga") { id }
        }"#;
        let book_res = schema.exec(query, value!({})).await;

        let query = r#"mutation($id: ID!) {
            createMemo(bookId: $id) { id }
        }"#;
        let vars = value!({ "id": get_id(&book_res, "hoge") });
        let memo_res = schema.exec(query, vars).await;

        let query = r#"query($bookId: ID!, $memoId: ID!) {
            book(id: $bookId) {
                memo(id: $memoId) { id }
            }
        }"#;
        let vars = value!({
            "bookId": get_id(&book_res, "fuga"),
            "memoId": get_id(&memo_res, "createMemo"),
        });
        let res = schema.exec(query, vars).await;
        assert_eq!(res, Response::new(value!({ "book": { "memo": null } })));
    }
    #[tokio::test]
    async fn book_connetion() {
        let schema = Schema::new().await.unwrap();
        fn get_node(res: &Response, index: usize) -> serde_json::Value {
            let data = &res.data.clone().into_json().unwrap();
            let edges = obj_get(obj_get(data, "books"), "edges");
            obj_get(edges.as_array().unwrap().get(index).unwrap(), "node").clone()
        }
        fn get_page_info(res: &Response) -> serde_json::Value {
            let data = &res.data.clone().into_json().unwrap();
            let page_info = obj_get(obj_get(data, "books"), "pageInfo");
            page_info.clone()
        }

        let query = r#"mutation($title: String!) {
            createBook(title: $title) { id }
        }"#;
        schema.exec(query, value!({ "title": "hoge" })).await;
        sleep(Duration::from_millis(1)).await;
        schema.exec(query, value!({ "title": "fuga" })).await;
        sleep(Duration::from_millis(1)).await;
        schema.exec(query, value!({ "title": "piyo" })).await;

        let query = r#"query($cursor: String) {
            books(first: 1, after: $cursor) {
                edges { node { title } }
                pageInfo { endCursor hasNextPage }
            }
        }"#;
        let res = schema.exec(query, value!({})).await;
        assert_eq!(get_node(&res, 0), json!({ "title": "piyo" }));
        assert_eq!(obj_get(&get_page_info(&res), "hasNextPage"), &json!(true));

        let vars = value!({ "cursor": obj_get(&get_page_info(&res), "endCursor") });
        let res = schema.exec(query, vars).await;
        assert_eq!(get_node(&res, 0), json!({ "title": "fuga" }));
        assert_eq!(obj_get(&get_page_info(&res), "hasNextPage"), &json!(true));

        let vars = value!({ "cursor": obj_get(&get_page_info(&res), "endCursor") });
        let res = schema.exec(query, vars).await;
        assert_eq!(get_node(&res, 0), json!({ "title": "hoge" }));
        assert_eq!(obj_get(&get_page_info(&res), "hasNextPage"), &json!(false));
    }
    #[tokio::test]
    async fn memo_connetion() {
        let schema = Schema::new().await.unwrap();
        fn get_id(res: &Response, key: &str) -> String {
            let data = res.data.clone().into_json().unwrap();
            let id = obj_get(obj_get(&data, key), "id");
            id.as_str().unwrap().to_string()
        }
        fn get_node(res: &Response, index: usize) -> serde_json::Value {
            let data = &res.data.clone().into_json().unwrap();
            let edges = obj_get(obj_get(obj_get(data, "book"), "memos"), "edges");
            obj_get(edges.as_array().unwrap().get(index).unwrap(), "node").clone()
        }
        fn get_page_info(res: &Response) -> serde_json::Value {
            let data = &res.data.clone().into_json().unwrap();
            let page_info = obj_get(obj_get(obj_get(data, "book"), "memos"), "pageInfo");
            page_info.clone()
        }

        // create book
        let query = r#"mutation($title: String!) {
            createBook(title: $title) { id }
        }"#;
        let res = schema.exec(query, value!({ "title": "hoge" })).await;
        let book_id = get_id(&res, "createBook");

        // create memos
        let query = r#"mutation($id: ID!) {
            createMemo(bookId: $id) { id }
        }"#;
        let hoge = schema.exec(query, value!({ "id": book_id })).await;
        sleep(Duration::from_millis(1)).await;
        let fuga = schema.exec(query, value!({ "id": book_id })).await;
        sleep(Duration::from_millis(1)).await;
        let piyo = schema.exec(query, value!({ "id": book_id })).await;

        // fetch memos
        let query = r#"query($id: ID!, $cursor: String) {
            book(id: $id) {
                memos(first: 1, after: $cursor) {
                    edges { node { id } }
                    pageInfo { endCursor hasNextPage }
                }
            }
        }"#;
        let res = schema.exec(query, value!({ "id": book_id })).await;
        assert_eq!(
            get_node(&res, 0),
            json!({ "id": get_id(&piyo,"createMemo") })
        );
        assert_eq!(obj_get(&get_page_info(&res), "hasNextPage"), &json!(true));

        let vars = value!({ "id": book_id, "cursor": obj_get(&get_page_info(&res), "endCursor") });
        let res = schema.exec(query, vars).await;
        assert_eq!(
            get_node(&res, 0),
            json!({ "id": get_id(&fuga,"createMemo") })
        );
        assert_eq!(obj_get(&get_page_info(&res), "hasNextPage"), &json!(true));

        let vars = value!({ "id": book_id, "cursor": obj_get(&get_page_info(&res), "endCursor") });
        let res = schema.exec(query, vars).await;
        assert_eq!(
            get_node(&res, 0),
            json!({ "id": get_id(&hoge,"createMemo") })
        );
        assert_eq!(obj_get(&get_page_info(&res), "hasNextPage"), &json!(false));
    }
}
