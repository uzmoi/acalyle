use crate::db::{
    book::{
        delete_book, fetch_books, insert_book, Book, BookHandle, BookId, BookSortOrderBy, SortOrder,
    },
    loader::{SqliteLoader, SqliteTagLoader},
    memo::{Memo, MemoId},
};
use async_graphql::{
    connection::{self, Connection, Edge},
    dataloader::DataLoader,
    Context, Object, Result, Upload, ID,
};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

#[derive(Default)]
pub(super) struct BookQuery;

#[Object]
impl BookQuery {
    // TODO bookByHandle
    async fn book(
        &self,
        ctx: &Context<'_>,
        id: Option<ID>,
        handle: Option<String>,
    ) -> Result<Option<Book>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let handle = id
            .map(|id| BookHandle::Id(id.to_string()))
            .or_else(|| handle.map(|handle| BookHandle::Handle(handle.to_string())))
            .ok_or_else(|| async_graphql::Error::new("id or handle is required"))?;
        Ok(loader.load_one(handle).await?)
    }
    async fn books(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
        query: Option<String>,
    ) -> Result<Connection<String, Book, BookConnectionExtend>> {
        let pool = ctx.data::<SqlitePool>()?;

        connection::query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                let forward_pagination = first.map(|first| (first, after, None));
                let backward_pagination = last.map(|last| (last, None, before));
                let (limit, lt_cursor, gt_cursor) =
                    forward_pagination.xor(backward_pagination).unwrap();

                let query = crate::db::book::BookQuery {
                    filter: query.unwrap_or_default(),
                    order: SortOrder::Desc,
                    order_by: BookSortOrderBy::Updated,
                    lt_cursor: lt_cursor.zip(Some(false)),
                    gt_cursor: gt_cursor.zip(Some(false)),
                    offset: 0,
                    limit: (limit + 1) as i32,
                };
                let books = fetch_books(pool, query).await?;

                let has_previous_page = last.map_or(false, |last| last < books.len());
                let has_next_page = first.map_or(false, |first| first < books.len());
                let mut connection = Connection::with_additional_fields(
                    has_previous_page,
                    has_next_page,
                    BookConnectionExtend {},
                );
                let book_edges = books
                    .into_iter()
                    .take(limit)
                    .map(|book| Edge::new(book.id.clone(), book));
                connection.edges.extend(book_edges);
                Ok::<_, async_graphql::Error>(connection)
            },
        )
        .await
    }
}

struct BookConnectionExtend;

#[Object]
impl BookConnectionExtend {
    #[allow(unreachable_code)]
    async fn total_count(&self) -> i32 {
        todo!()
    }
}

#[Object]
impl Book {
    pub(super) async fn id(&self) -> ID {
        ID(self.id.clone())
    }
    async fn handle(&self) -> Option<String> {
        self.handle.clone()
    }
    async fn title(&self) -> String {
        self.title.clone()
    }
    async fn description(&self) -> String {
        self.description.clone()
    }
    async fn thumbnail(&self) -> String {
        self.thumbnail.clone()
    }
    async fn created_at(&self) -> DateTime<Utc> {
        self.created_at
    }
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Option<Memo>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let memo = loader.load_one(MemoId(id.to_string())).await?;
        Ok(memo.filter(|memo| memo.book_id == self.id))
    }
    #[allow(unreachable_code)]
    async fn memos(
        &self,
        _after: Option<String>,
        _before: Option<String>,
        _first: Option<i32>,
        _last: Option<i32>,
        _search: Option<String>,
    ) -> Result<Connection<usize, Memo, MemoConnectionExtend>> {
        todo!()
    }
    async fn tags(&self, ctx: &Context<'_>) -> Result<Vec<String>> {
        let loader = ctx.data::<DataLoader<SqliteTagLoader>>()?;
        let tags = loader.load_one(BookId(self.id.clone())).await?;
        Ok(tags.unwrap_or_default())
    }
    // TODO rename input "name" to "symbol"
    #[allow(unreachable_code)]
    async fn tag_props(&self, _name: String) -> Vec<String> {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn resources(&self) -> Vec<String> {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn settings(&self) -> BookSetting {
        todo!()
    }
}

struct MemoConnectionExtend;

#[Object]
impl MemoConnectionExtend {
    #[allow(unreachable_code)]
    async fn total_count(&self) -> i32 {
        todo!()
    }
}

struct BookSetting;

#[Object]
impl BookSetting {
    #[allow(unreachable_code)]
    async fn extensions(&self) -> Vec<String> {
        todo!()
    }
}

#[derive(Default)]
pub(super) struct BookMutation;

#[Object]
impl BookMutation {
    // TODO thumbnailに対応
    async fn create_book(
        &self,
        ctx: &Context<'_>,
        title: String,
        description: Option<String>,
        _thumbnail: Option<Upload>,
    ) -> Result<Book> {
        let id = Uuid::new_v4();
        let now = Utc::now();

        let book = Book {
            id: id.to_string(),
            handle: None,
            title,
            description: description.unwrap_or_default(),
            thumbnail: format!("color:hsl({}deg,80%,40%)", rand::random::<f32>() * 360f32),
            created_at: now,
            updated_at: now,
            settings: Vec::new(),
        };

        let pool = ctx.data::<SqlitePool>()?;

        insert_book(pool, [book.clone()]).await?;

        Ok(book)
    }
    #[allow(unreachable_code)]
    async fn update_book_title(&self, _id: ID, _title: String) -> Book {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn update_book_thumbnail(&self, _id: ID, _thumbnail: Option<Upload>) -> Book {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn upload_resource(
        &self,
        _book_id: ID,
        _file_name: String,
        _file: Option<Upload>,
    ) -> String {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn rename_tag(&self, _book_id: ID, _new_symbol: String, _old_symbol: String) -> String {
        todo!()
    }
    async fn delete_book(&self, ctx: &Context<'_>, id: ID) -> Result<ID> {
        let pool = ctx.data::<SqlitePool>()?;
        delete_book(pool, &[id.to_string()]).await?;
        Ok(id)
    }
}
