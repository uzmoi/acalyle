use super::memo::Memo;
use async_graphql::{connection::Connection, Object, Upload, ID};
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

struct BookData {
    _handle: String,
    _title: String,
    _description: String,
    _thumbnail: String,
    _created_at: DateTime<Utc>,
}

pub(super) struct Book {
    id: ID,
    _book: Option<BookData>,
}

#[allow(unreachable_code)]
#[Object]
impl Book {
    pub(super) async fn id(&self) -> ID {
        self.id.clone()
    }
    async fn handle(&self) -> Option<String> {
        todo!()
    }
    async fn title(&self) -> String {
        todo!()
    }
    async fn description(&self) -> String {
        todo!()
    }
    async fn thumbnail(&self) -> String {
        todo!()
    }
    async fn created_at(&self) -> DateTime<Utc> {
        todo!()
    }
    async fn memo(&self, _id: ID) -> Option<Memo> {
        todo!()
    }
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
    //   resources: [String!]!
    //   settings: BookSetting!
    async fn tags(&self) -> Vec<String> {
        todo!()
    }
    // TODO rename input "name" to "symbol"
    async fn tag_props(&self, _name: String) -> Vec<String> {
        todo!()
    }
    async fn resources(&self) -> Vec<String> {
        todo!()
    }
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
