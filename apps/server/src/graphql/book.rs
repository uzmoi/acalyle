use super::memo::Memo;
use crate::db::{
    book::{delete_book, insert_book, BookData, BookHandle, BookId},
    loader::{SqliteLoader, SqliteTagLoader},
    memo::MemoId,
};
use async_graphql::{
    connection::Connection, dataloader::DataLoader, Context, Object, Result, Upload, ID,
};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

#[derive(Default)]
pub(super) struct BookQuery;

#[Object]
impl BookQuery {
    // TODO handleに対応
    async fn book(
        &self,
        ctx: &Context<'_>,
        id: Option<ID>,
        _handle: Option<String>,
    ) -> Result<Book> {
        let loader = ctx.data_unchecked::<DataLoader<SqliteLoader>>();
        let id = id.unwrap().to_string();
        let book = loader.load_one(BookHandle::Id(id.clone())).await?;
        Ok(Book::new(id, book))
    }
    #[allow(unreachable_code)]
    async fn books(
        &self,
        _after: Option<String>,
        _before: Option<String>,
        _first: Option<i32>,
        _last: Option<i32>,
        _query: Option<String>,
    ) -> Option<Connection<usize, Book, BookConnectionExtend>> {
        todo!()
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

pub(super) struct Book {
    id: BookHandle,
    book: Option<BookData>,
}

impl Book {
    pub(crate) fn new(id: String, book: Option<BookData>) -> Book {
        Book {
            id: BookHandle::Id(id),
            book,
        }
    }
    async fn load_book(&self, ctx: &Context<'_>) -> BookData {
        if let Some(book) = &self.book {
            return book.clone();
        }
        let loader = ctx.data_unchecked::<DataLoader<SqliteLoader>>();
        let book = loader.load_one(self.id.clone()).await;
        book.unwrap().unwrap()
    }
}

#[Object]
impl Book {
    pub(super) async fn id(&self, ctx: &Context<'_>) -> ID {
        ID(self.load_book(ctx).await.id)
    }
    async fn handle(&self, ctx: &Context<'_>) -> Option<String> {
        self.load_book(ctx).await.handle
    }
    async fn title(&self, ctx: &Context<'_>) -> String {
        self.load_book(ctx).await.title
    }
    async fn description(&self, ctx: &Context<'_>) -> String {
        self.load_book(ctx).await.description
    }
    async fn thumbnail(&self, ctx: &Context<'_>) -> String {
        self.load_book(ctx).await.thumbnail
    }
    async fn created_at(&self, ctx: &Context<'_>) -> DateTime<Utc> {
        self.load_book(ctx).await.created_at
    }
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Memo> {
        let loader = ctx.data_unchecked::<DataLoader<SqliteLoader>>();
        let memo = loader.load_one(MemoId(id.to_string())).await?;
        Ok(Memo::new(id.to_string(), memo))
    }
    #[allow(unreachable_code)]
    async fn memos(
        &self,
        _after: Option<String>,
        _before: Option<String>,
        _first: Option<i32>,
        _last: Option<i32>,
        _search: Option<String>,
    ) -> Option<Connection<usize, Memo, MemoConnectionExtend>> {
        todo!()
    }
    async fn tags(&self, ctx: &Context<'_>) -> Vec<String> {
        let id = BookId(if let BookHandle::Id(id) = self.id.clone() {
            id
        } else {
            self.load_book(ctx).await.id
        });
        let loader = ctx.data_unchecked::<DataLoader<SqliteTagLoader>>();
        let tags = loader.load_one(id).await;
        tags.unwrap().unwrap_or_default()
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

        let book = BookData {
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

        Ok(Book::new(id.to_string(), Some(book)))
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
