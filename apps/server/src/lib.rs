mod db;
mod graphql;

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;
    use async_graphql::{value, Request, Response, Value, Variables};
    use sqlx::SqlitePool;

    struct Schema(graphql::GraphQLSchema);

    impl Schema {
        async fn new() -> sqlx::Result<Schema> {
            let pool = SqlitePool::connect("sqlite::memory:").await?;

            sqlx::query(
                "CREATE TABLE Book (
                    id TEXT NOT NULL PRIMARY KEY,
                    handle TEXT,
                    thumbnail TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    createdAt DATETIME NOT NULL,
                    updatedAt DATETIME NOT NULL,
                    settings BLOB NOT NULL
                )",
            )
            .execute(&pool)
            .await?;

            sqlx::query(
                "CREATE TABLE Memo (
                    id TEXT NOT NULL PRIMARY KEY,
                    contents TEXT NOT NULL,
                    createdAt DATETIME NOT NULL,
                    updatedAt DATETIME NOT NULL,
                    bookId TEXT NOT NULL,
                    CONSTRAINT Memo_bookId_f_key FOREIGN KEY (bookId) REFERENCES Book (id)
                        ON DELETE CASCADE
                        ON UPDATE CASCADE
                )",
            )
            .execute(&pool)
            .await?;

            sqlx::query(
                "CREATE TABLE Tag (
                    memoId TEXT NOT NULL,
                    symbol TEXT NOT NULL,
                    prop TEXT,
                    PRIMARY KEY (memoId, symbol),
                    CONSTRAINT MemoTag_memoId_f_key FOREIGN KEY (memoId) REFERENCES Memo (id)
                        ON DELETE RESTRICT
                        ON UPDATE CASCADE
                )",
            )
            .execute(&pool)
            .await?;

            Ok(Schema(graphql::graphql_schema(pool)))
        }
        async fn exec(&self, query: &str, vars: Value) -> Response {
            let req = Request::new(query).variables(Variables::from_value(vars));
            self.0.execute(req).await
        }
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
        fn obj_get<'a>(obj: &'a serde_json::Value, key: &str) -> &'a serde_json::Value {
            obj.as_object().unwrap().get(key).unwrap()
        }
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

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
