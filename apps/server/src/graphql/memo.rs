use crate::db::{
    book::{update_book, update_book_by_memo_id, Book, BookHandle, BookId},
    loader::{SqliteLoader, SqliteTagLoader},
    memo::{
        delete_memo, delete_tags, insert_memos, insert_tags, transfer_memo, update_memo_contents,
        Memo, MemoId, MemoTag,
    },
};
use async_graphql::{dataloader::DataLoader, Context, InputObject, Object, Result, ID};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
use uuid::Uuid;

use super::node::NodeType;

#[derive(Default)]
pub(super) struct MemoQuery;

#[Object]
impl MemoQuery {
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Option<Memo>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        Ok(loader.load_one(MemoId(id.0)).await?)
    }
}

impl NodeType for Memo {
    fn id(&self) -> String {
        self.id.0.clone()
    }
}

#[Object]
impl Memo {
    pub(super) async fn id(&self) -> ID {
        ID(self.id.0.clone())
    }
    async fn contents(&self) -> String {
        self.contents.clone()
    }
    async fn tags(&self, ctx: &Context<'_>) -> Result<Vec<String>> {
        let loader = ctx.data::<DataLoader<SqliteTagLoader>>()?;
        let tags = loader.load_one(self.id.clone()).await?;
        Ok(tags.unwrap_or_default())
    }
    async fn created_at(&self) -> DateTime<Utc> {
        self.created_at
    }
    async fn updated_at(&self) -> DateTime<Utc> {
        self.updated_at
    }
    async fn book(&self, ctx: &Context<'_>) -> Result<Book> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let book = loader
            .load_one(BookHandle::Id(self.book_id.0.clone()))
            .await?;
        book.ok_or_else(|| async_graphql::Error::new("book not found"))
    }
}

#[derive(Default)]
pub(super) struct MemoMutation;

#[Object]
impl MemoMutation {
    // TODO templateに対応
    async fn create_memo(
        &self,
        ctx: &Context<'_>,
        book_id: ID,
        _template: Option<String>,
    ) -> Result<Memo> {
        let pool = ctx.data::<SqlitePool>()?;
        let id = Uuid::new_v4();
        let contents = "";
        let now = Utc::now();

        let memo = Memo {
            id: MemoId(id.to_string()),
            contents: contents.to_string(),
            created_at: now,
            updated_at: now,
            book_id: BookId(book_id.to_string()),
        };

        insert_memos(pool, [memo.clone()]).await?;
        update_book(pool, &memo.book_id, &now).await?;

        Ok(memo)
    }
    async fn import_memos(
        &self,
        ctx: &Context<'_>,
        book_id: ID,
        memos: Vec<MemoInput>,
    ) -> Result<bool> {
        let pool = ctx.data::<SqlitePool>()?;
        let now = Utc::now();

        insert_memos(
            pool,
            memos.iter().map(|memo| Memo {
                id: MemoId(memo.id.to_string()),
                contents: memo.contents.clone(),
                created_at: memo.created_at,
                updated_at: memo.updated_at,
                book_id: BookId(book_id.to_string()),
            }),
        )
        .await?;

        fn memo_tags<'a>(memos: &'a [MemoInput]) -> impl IntoIterator<Item = MemoTag> + 'a {
            memos.iter().flat_map(|memo| {
                memo.tags.iter().filter_map(|tag| {
                    // cspell:ignore splitn
                    let mut tag = tag.splitn(2, ':');
                    Some(MemoTag::new(
                        MemoId(memo.id.to_string()),
                        tag.next()?.to_string(),
                        tag.next().map(|prop| prop.to_string()),
                    ))
                })
            })
        }
        insert_tags(pool, memo_tags(&memos)).await?;

        update_book(pool, &BookId(book_id.0), &now).await?;

        Ok(true)
    }
    async fn update_memo_contents(
        &self,
        ctx: &Context<'_>,
        id: ID,
        contents: String,
    ) -> Result<Option<Memo>> {
        let pool = ctx.data::<SqlitePool>()?;
        let now = Utc::now();

        let id = MemoId(id.0);
        update_memo_contents(pool, &id, contents, &now).await?;

        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let memo = loader.load_one(id).await?;

        if let Some(memo) = &memo {
            update_book(pool, &memo.book_id, &now).await?;
        }

        Ok(memo)
    }
    #[allow(unreachable_code)]
    async fn upsert_memo_tags(&self, _ids: Vec<ID>, _tags: Vec<String>) -> Vec<Memo> {
        todo!()
    }
    async fn remove_memo_tags(
        &self,
        ctx: &Context<'_>,
        ids: Vec<ID>,
        symbols: Vec<String>,
    ) -> Result<Vec<Option<Memo>>> {
        let pool = ctx.data::<SqlitePool>()?;
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let now = Utc::now();
        let memo_ids = ids.into_iter().map(|memo_id| MemoId(memo_id.0));

        delete_tags(pool, memo_ids.clone(), symbols).await?;
        update_book_by_memo_id(pool, memo_ids.clone(), &now).await?;

        let memos = loader.load_many(memo_ids.clone()).await?;
        let memos = memo_ids.map(|memo_id| memos.clone().get(&memo_id).cloned());
        Ok(memos.collect())
    }
    async fn remove_memo(&self, ctx: &Context<'_>, ids: Vec<ID>) -> Result<Vec<ID>> {
        let pool = ctx.data::<SqlitePool>()?;
        let now = Utc::now();
        let memo_ids = ids.clone().into_iter().map(|memo_id| MemoId(memo_id.0));

        delete_memo(pool, memo_ids.clone()).await?;
        update_book_by_memo_id(pool, memo_ids, &now).await?;
        Ok(ids)
    }
    async fn transfer_memo(
        &self,
        ctx: &Context<'_>,
        memo_ids: Vec<ID>,
        book_id: ID,
    ) -> Result<bool> {
        let pool = ctx.data::<SqlitePool>()?;
        let memo_ids = memo_ids.into_iter().map(|memo_id| MemoId(memo_id.0));

        transfer_memo(pool, memo_ids, &BookId(book_id.0)).await?;
        Ok(true)
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
