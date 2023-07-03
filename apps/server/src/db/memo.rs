use super::{
    book::BookId,
    loader::{SqliteLoader, SqliteTagLoader},
    util::QueryBuilderExt,
};
use crate::query::NodeListQuery;
use async_graphql::{
    async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt, Result,
};
use chrono::{DateTime, Utc};
use sqlx::SqliteExecutor;
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash, sqlx::Type)]
#[sqlx(transparent)]
pub(crate) struct MemoId(pub String);

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct Memo {
    pub id: MemoId,
    pub contents: String,
    #[sqlx(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[sqlx(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
    #[sqlx(rename = "bookId")]
    pub book_id: BookId,
}

#[derive(strum::Display)]
pub(crate) enum MemoSortOrderBy {
    #[strum(serialize = "createdAt")]
    Created,
    #[strum(serialize = "updatedAt")]
    Updated,
}

pub(crate) async fn fetch_memos(
    executor: impl SqliteExecutor<'_>,
    query: NodeListQuery<(BookId, String), MemoSortOrderBy>,
) -> Result<Vec<Memo>> {
    let mut query_builder = sqlx::QueryBuilder::new(
        "SELECT id, contents, createdAt, updatedAt, bookId FROM Memo WHERE ",
    );

    // cursor
    if let Some((lt_cursor, eq)) = query.lt_cursor {
        query_builder.push(&query.order_by);
        query_builder.push(if eq { " <=" } else { " <" });
        query_builder.push(" (SELECT ");
        query_builder.push(&query.order_by);
        query_builder.push(" FROM Memo WHERE id = ");
        query_builder.push_bind(lt_cursor);
        query_builder.push(") AND ");
    }
    if let Some((gt_cursor, eq)) = query.gt_cursor {
        query_builder.push(&query.order_by);
        query_builder.push(if eq { " >=" } else { " >" });
        query_builder.push(" (SELECT ");
        query_builder.push(&query.order_by);
        query_builder.push(" FROM Memo WHERE id = ");
        query_builder.push_bind(gt_cursor);
        query_builder.push(") AND ");
    }
    // filter
    let filter = format!("%{}%", query.filter.1);
    query_builder.push("(contents LIKE ");
    query_builder.push_bind(&filter);
    query_builder.push(") AND bookId = ");
    query_builder.push_bind(query.filter.0 .0);
    query_builder.push(" ");

    let mut separated = query_builder.separated(" ");
    separated.push("ORDER BY");
    separated.push(query.order_by);
    separated.push(query.order);
    separated.push("LIMIT");
    separated.push_bind(query.limit);
    separated.push("OFFSET");
    separated.push_bind(query.offset);

    let query = query_builder.build_query_as::<Memo>();

    Ok(query.fetch_all(executor).await?)
}

pub(crate) async fn count_memos(
    executor: impl SqliteExecutor<'_>,
    filter: (BookId, String),
) -> Result<i32> {
    let mut query_builder = sqlx::QueryBuilder::new("SELECT COUNT(*) FROM Memo WHERE ");

    // filter
    let contents_filter = format!("%{}%", filter.1);
    query_builder.push("(contents LIKE ");
    query_builder.push_bind(&contents_filter);
    query_builder.push(") AND bookId = ");
    query_builder.push_bind(filter.0 .0);

    let query = query_builder.build_query_as::<(i32,)>();

    Ok(query.fetch_one(executor).await?.0)
}

#[async_trait]
impl Loader<MemoId> for SqliteLoader {
    type Value = Memo;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[MemoId]) -> Result<HashMap<MemoId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(
            "SELECT id, contents, createdAt, updatedAt, bookId FROM Memo WHERE id IN",
        );
        query_builder.push_bind_values(keys);
        let query = query_builder.build_query_as::<Memo>();

        Ok(query
            .fetch(&self.pool)
            .map_ok(|memo| (memo.id.clone(), memo))
            .map_err(Arc::new)
            .try_collect()
            .await?)
    }
}

pub(crate) async fn insert_memos(
    executor: impl SqliteExecutor<'_>,
    memos: impl IntoIterator<Item = Memo>,
) -> Result<()> {
    let mut query_builder =
        sqlx::QueryBuilder::new("INSERT INTO Memo(id, contents, createdAt, updatedAt, bookId) ");
    query_builder.push_values(memos, |mut separated, memo| {
        separated
            .push_bind(memo.id)
            .push_bind(memo.contents)
            .push_bind(memo.created_at)
            .push_bind(memo.updated_at)
            .push_bind(memo.book_id);
    });
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

pub(crate) async fn update_memo_contents(
    executor: impl SqliteExecutor<'_>,
    memo_id: &MemoId,
    contents: String,
    updated_at: &DateTime<Utc>,
) -> sqlx::Result<()> {
    let query = sqlx::query("UPDATE Memo SET contents = ?, updatedAt = ? WHERE id = ?");
    query
        .bind(contents)
        .bind(updated_at)
        .bind(memo_id)
        .execute(executor)
        .await?;
    Ok(())
}

pub(crate) async fn delete_memo(
    executor: impl SqliteExecutor<'_>,
    memo_ids: impl IntoIterator<Item = MemoId>,
) -> sqlx::Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("DELETE Memo WHERE id IN");
    query_builder.push_bind_values(memo_ids);
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

pub(crate) async fn transfer_memo(
    executor: impl SqliteExecutor<'_>,
    memo_ids: impl IntoIterator<Item = MemoId>,
    dest_book_id: &BookId,
) -> sqlx::Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("UPDATE Memo SET bookId = ");
    query_builder.push_bind(dest_book_id);
    query_builder.push(" WHERE id IN");
    query_builder.push_bind_values(memo_ids);
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct MemoTag {
    #[sqlx(rename = "memoId")]
    memo_id: MemoId,
    symbol: String,
    prop: Option<String>,
}

impl MemoTag {
    pub(crate) fn new(memo_id: MemoId, symbol: String, prop: Option<String>) -> MemoTag {
        MemoTag {
            memo_id,
            symbol,
            prop,
        }
    }
}

#[async_trait]
impl Loader<MemoId> for SqliteTagLoader {
    type Value = Vec<String>;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[MemoId]) -> Result<HashMap<MemoId, Self::Value>, Self::Error> {
        let mut query_builder =
            sqlx::QueryBuilder::new("SELECT memoId, symbol, prop FROM Tag WHERE memoId IN");
        query_builder.push_bind_values(keys);
        let query = query_builder.build_query_as::<MemoTag>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, tag| {
                let tag_string = tag.prop.as_ref().map_or_else(
                    || tag.symbol.to_owned(),
                    |prop| format!("{}:{prop}", tag.symbol),
                );
                accum
                    .entry(tag.memo_id.to_owned())
                    .or_insert_with(Vec::new)
                    .push(tag_string);
                accum
            }))
    }
}

pub(crate) async fn insert_tags(
    executor: impl SqliteExecutor<'_>,
    tags: impl IntoIterator<Item = MemoTag>,
) -> Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("INSERT INTO Tag(memoId, symbol, prop) ");
    query_builder.push_values(tags, |mut separated, tag| {
        separated
            .push_bind(tag.memo_id)
            .push_bind(tag.symbol)
            .push_bind(tag.prop);
    });
    let query = query_builder.build();
    query.execute(executor).await?;
    Ok(())
}

pub(crate) async fn delete_tags(
    executor: impl SqliteExecutor<'_>,
    memo_ids: impl IntoIterator<Item = MemoId>,
    tag_symbols: impl IntoIterator<Item = String>,
) -> Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("DELETE Tag WHERE memoId IN");
    query_builder.push_bind_values(memo_ids);
    query_builder.push(" AND symbol IN");
    query_builder.push_bind_values(tag_symbols);
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}
