use super::memo::Memo;
use crate::db::{
    book::{BookData, BookId},
    loader::SqliteLoader,
};
use async_graphql::{connection::Connection, dataloader::DataLoader, Context, Object, Upload, ID};
use chrono::{DateTime, Utc};

#[derive(Default)]
pub(super) struct BookQuery;

#[allow(unreachable_code)]
#[Object]
impl BookQuery {
    async fn book(&self, _id: Option<ID>, _handle: Option<String>) -> Option<Book> {
        todo!()
    }
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

#[allow(unreachable_code)]
#[Object]
impl BookConnectionExtend {
    async fn total_count(&self) -> i32 {
        todo!()
    }
}

pub(super) struct Book {
    id: BookId,
    book: Option<BookData>,
}

impl Book {
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
    pub(super) async fn id(&self) -> ID {
        ID(self.id.0.clone())
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
    #[allow(unreachable_code)]
    async fn memo(&self, _id: ID) -> Option<Memo> {
        todo!()
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
    #[allow(unreachable_code)]
    async fn tags(&self) -> Vec<String> {
        todo!()
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

#[allow(unreachable_code)]
#[Object]
impl MemoConnectionExtend {
    async fn total_count(&self) -> i32 {
        todo!()
    }
}

struct BookSetting;

#[allow(unreachable_code)]
#[Object]
impl BookSetting {
    async fn extensions(&self) -> Vec<String> {
        todo!()
    }
}

#[derive(Default)]
pub(super) struct BookMutation;

#[allow(unreachable_code)]
#[Object]
impl BookMutation {
    async fn create_book(
        &self,
        _title: String,
        _description: Option<String>,
        _thumbnail: Option<Upload>,
    ) -> Book {
        todo!()
    }
    async fn update_book_title(&self, _id: ID, _title: String) -> Book {
        todo!()
    }
    async fn update_book_thumbnail(&self, _id: ID, _thumbnail: Option<Upload>) -> Book {
        todo!()
    }
    async fn upload_resource(
        &self,
        _book_id: ID,
        _file_name: String,
        _file: Option<Upload>,
    ) -> String {
        todo!()
    }
    async fn rename_tag(&self, _book_id: ID, _new_symbol: String, _old_symbol: String) -> String {
        todo!()
    }
    async fn delete_book(&self, _id: ID) -> ID {
        todo!()
    }
}
