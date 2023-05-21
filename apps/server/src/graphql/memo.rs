use super::book::Book;
use crate::db::{
    loader::{SqliteLoader, SqliteTagLoader},
    memo::{delete_memo, insert_memos, insert_tags, MemoData, MemoId, MemoTag},
};
use async_graphql::{dataloader::DataLoader, Context, InputObject, Object, Result, ID};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

#[derive(Default)]
pub(super) struct MemoQuery;

#[Object]
impl MemoQuery {
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Memo> {
        let loader = ctx.data_unchecked::<DataLoader<SqliteLoader>>();
        let id = MemoId(id.to_string());
        let memo = loader.load_one(id.clone()).await?;
        Ok(Memo { id, memo })
    }
}

pub(super) struct Memo {
    id: MemoId,
    memo: Option<MemoData>,
}

impl Memo {
    async fn load_memo(&self, ctx: &Context<'_>) -> MemoData {
        if let Some(memo) = &self.memo {
            return memo.clone();
        }
        let loader = ctx.data_unchecked::<DataLoader<SqliteLoader>>();
        let memo = loader.load_one(self.id.clone()).await;
        memo.unwrap().unwrap()
    }
}

#[Object]
impl Memo {
    pub(super) async fn id(&self) -> ID {
        ID(self.id.0.clone())
    }
    async fn contents(&self, ctx: &Context<'_>) -> String {
        self.load_memo(ctx).await.contents
    }
    async fn tags(&self, ctx: &Context<'_>) -> Vec<String> {
        let loader = ctx.data_unchecked::<DataLoader<SqliteTagLoader>>();
        let tags = loader.load_one(self.id.clone()).await;
        tags.unwrap().unwrap()
    }
    async fn created_at(&self, ctx: &Context<'_>) -> DateTime<Utc> {
        self.load_memo(ctx).await.created_at
    }
    async fn updated_at(&self, ctx: &Context<'_>) -> DateTime<Utc> {
        self.load_memo(ctx).await.updated_at
    }
    #[allow(unreachable_code)]
    async fn book(&self) -> Book {
        todo!()
    }
}

#[derive(Default)]
pub(super) struct MemoMutation;

#[allow(unreachable_code)]
#[Object]
impl MemoMutation {
    // TODO templateに対応
    // TODO Book.updatedAtを更新
    async fn create_memo(
        &self,
        ctx: &Context<'_>,
        book_id: ID,
        _template: Option<String>,
    ) -> Result<Memo> {
        let id = Uuid::new_v4();
        let contents = "";
        let now = Utc::now();

        let memo = MemoData {
            id: id.to_string(),
            contents: contents.to_string(),
            created_at: now,
            updated_at: now,
            book_id: book_id.to_string(),
        };

        let pool = ctx.data::<SqlitePool>()?;

        insert_memos(pool, [memo.clone()]).await?;

        Ok(Memo {
            id: MemoId(id.to_string()),
            memo: Some(memo),
        })
    }
    // TODO Book.updatedAtを更新
    async fn import_memos(
        &self,
        ctx: &Context<'_>,
        book_id: ID,
        memos: Vec<MemoInput>,
    ) -> Result<bool> {
        let pool = ctx.data::<SqlitePool>()?;

        insert_memos(
            pool,
            memos.iter().map(|memo| MemoData {
                id: memo.id.to_string(),
                contents: memo.contents.clone(),
                created_at: memo.created_at,
                updated_at: memo.updated_at,
                book_id: book_id.to_string(),
            }),
        )
        .await?;

        fn memo_tags<'a>(memos: &'a [MemoInput]) -> impl IntoIterator<Item = MemoTag> + 'a {
            memos.iter().flat_map(|memo| {
                memo.tags.iter().filter_map(|tag| {
                    // cspell:ignore splitn
                    let mut tag = tag.splitn(2, ':');
                    Some(MemoTag::new(
                        memo.id.to_string(),
                        tag.next()?.to_string(),
                        tag.next().map(|prop| prop.to_string()),
                    ))
                })
            })
        }
        insert_tags(pool, memo_tags(&memos)).await?;

        Ok(true)
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
    async fn remove_memo(&self, ctx: &Context<'_>, ids: Vec<ID>) -> Result<Vec<ID>> {
        let pool = ctx.data::<SqlitePool>()?;
        let memo_ids = ids
            .iter()
            .map(|memo_id| memo_id.to_string())
            .collect::<Vec<String>>();

        delete_memo(pool, &memo_ids).await?;
        Ok(ids)
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
