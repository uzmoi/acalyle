use super::book::Book;
use async_graphql::{InputObject, Object, ID};
use chrono::{DateTime, Utc};

struct MemoData {
    _contents: String,
    _created_at: DateTime<Utc>,
    _updated_at: DateTime<Utc>,
    _book_id: ID,
}

pub(super) struct Memo {
    id: ID,
    _memo: Option<MemoData>,
}

#[allow(unreachable_code)]
#[Object]
impl Memo {
    pub(super) async fn id(&self) -> ID {
        self.id.clone()
    }
    async fn contents(&self) -> String {
        todo!()
    }
    async fn tags(&self) -> Vec<String> {
        todo!()
    }
    async fn created_at(&self) -> DateTime<Utc> {
        todo!()
    }
    async fn updated_at(&self) -> DateTime<Utc> {
        todo!()
    }
    async fn book(&self) -> Book {
        todo!()
    }
}

#[derive(Default)]
pub(super) struct MemoMutation;

#[allow(unreachable_code)]
#[Object]
impl MemoMutation {
    async fn create_memo(&self, _book_id: ID, _template: Option<String>) -> Memo {
        todo!()
    }
    async fn import_memos(&self, _book_id: ID, _memos: Vec<MemoInput>) -> String {
        todo!()
    }
    async fn update_memo_contents(&self, _memo_id: ID, _contents: String) -> Memo {
        todo!()
    }
    async fn upsert_memo_tags(&self, _memo_ids: Vec<ID>, _tags: Vec<String>) -> Vec<Memo> {
        todo!()
    }
    async fn remove_memo_tags(&self, _memo_ids: Vec<ID>, _symbols: Vec<String>) -> Vec<Memo> {
        todo!()
    }
    // TODO rename "ids" to "memo_ids"
    async fn remove_memo(&self, _ids: Vec<ID>) -> Vec<ID> {
        todo!()
    }
    async fn transfer_memo(&self, _memo_ids: Vec<ID>, _book_id: ID) -> String {
        todo!()
    }
}

#[derive(InputObject)]
pub struct MemoInput {
    id: ID,
    contents: String,
    tags: Vec<String>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}
