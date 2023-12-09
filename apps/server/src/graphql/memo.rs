use crate::db::{
    book::{update_book, update_book_by_memo_id, Book, BookId},
    loader::{SqliteLoader, SqliteTagLoader},
    memo::{
        delete_memo, delete_tags, insert_memos, insert_tags, transfer_memo, update_memo_contents,
        Memo, MemoId, MemoSortOrderBy, MemoTag,
    },
};
use async_graphql::{dataloader::DataLoader, Context, InputObject, Object, Result, ID};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;

use super::{cursor::Cursor, node::NodeType};

#[derive(Default)]
pub(super) struct MemoQuery;

#[Object]
impl MemoQuery {
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Option<Memo>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let memo_id = MemoId::try_from(id)?;
        Ok(loader.load_one(memo_id).await?)
    }
}

impl NodeType<MemoSortOrderBy> for Memo {
    fn cursor(&self, _order_by: MemoSortOrderBy) -> Cursor {
        Cursor(self.id.to_string())
    }
}

#[Object]
impl Memo {
    pub(super) async fn id(&self) -> ID {
        self.id.to_id()
    }
    async fn contents(&self) -> &str {
        &self.contents
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
        let book = loader.load_one(self.book_id.clone()).await?;
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
        let book_id = BookId::try_from(book_id)?;
        let now = Utc::now();
        let memo = Memo::new(book_id, now);

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
        let book_id = BookId::try_from(book_id)?;
        let now = Utc::now();

        let mut tags = Vec::new();

        let memos = memos
            .into_iter()
            .map(|memo| -> Result<Memo, String> {
                let memo_id = MemoId::try_from(memo.id)?;
                tags.extend(
                    memo.tags
                        .iter()
                        .filter_map(|tag| MemoTag::parse(memo_id.clone(), tag)),
                );
                Ok(Memo {
                    id: memo_id,
                    contents: memo.contents.clone(),
                    created_at: memo.created_at,
                    updated_at: memo.updated_at,
                    book_id: book_id.clone(),
                })
            })
            .collect::<Result<Vec<_>, _>>()?;

        insert_memos(pool, memos).await?;

        insert_tags(pool, tags).await?;

        update_book(pool, &book_id, &now).await?;

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

        let id = MemoId::try_from(id)?;
        update_memo_contents(pool, &id, contents, &now).await?;

        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let memo = loader.load_one(id).await?;

        if let Some(memo) = &memo {
            update_book(pool, &memo.book_id, &now).await?;
        }

        Ok(memo)
    }
    async fn add_memo_tags(
        &self,
        ctx: &Context<'_>,
        ids: Vec<ID>,
        tags: Vec<String>,
    ) -> Result<Vec<Memo>> {
        let pool = ctx.data::<SqlitePool>()?;
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let now = Utc::now();
        let memo_ids = ids
            .into_iter()
            .map(MemoId::try_from)
            .collect::<Result<Vec<_>, _>>()?;

        let memo_tags = memo_ids.iter().flat_map(|memo_id| {
            tags.clone()
                .into_iter()
                .filter_map(move |tag| MemoTag::parse(memo_id.clone(), &tag))
        });
        insert_tags(pool, memo_tags).await?;
        update_book_by_memo_id(pool, memo_ids.clone(), &now).await?;

        let memos = loader.load_many(memo_ids).await?;
        Ok(memos.into_values().collect())
    }
    async fn remove_memo_tags(
        &self,
        ctx: &Context<'_>,
        ids: Vec<ID>,
        symbols: Vec<String>,
    ) -> Result<Vec<Memo>> {
        let pool = ctx.data::<SqlitePool>()?;
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let now = Utc::now();
        let memo_ids = ids
            .into_iter()
            .map(MemoId::try_from)
            .collect::<Result<Vec<_>, _>>()?;

        delete_tags(pool, memo_ids.clone(), symbols).await?;
        update_book_by_memo_id(pool, memo_ids.clone(), &now).await?;

        let memos = loader.load_many(memo_ids).await?;
        Ok(memos.into_values().collect())
    }
    async fn remove_memo(&self, ctx: &Context<'_>, ids: Vec<ID>) -> Result<Vec<ID>> {
        let pool = ctx.data::<SqlitePool>()?;
        let now = Utc::now();
        let memo_ids = ids
            .clone()
            .into_iter()
            .map(MemoId::try_from)
            .collect::<Result<Vec<_>, _>>()?;

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
        let book_id = BookId::try_from(book_id)?;
        let memo_ids = memo_ids
            .into_iter()
            .map(MemoId::try_from)
            .collect::<Result<Vec<_>, _>>()?;

        transfer_memo(pool, memo_ids, &book_id).await?;
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
