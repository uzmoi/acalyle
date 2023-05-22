use super::loader::{SqliteLoader, SqliteTagLoader};
use async_graphql::{
    async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt, Result,
};
use chrono::{DateTime, Utc};
use sqlx::SqliteExecutor;
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash)]
pub(crate) struct MemoId(pub String);

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct Memo {
    pub id: String,
    pub contents: String,
    #[sqlx(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[sqlx(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
    #[sqlx(rename = "bookId")]
    pub book_id: String,
}

#[async_trait]
impl Loader<MemoId> for SqliteLoader {
    type Value = Memo;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[MemoId]) -> Result<HashMap<MemoId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(
            "SELECT id, contents, createdAt, updatedAt, bookId FROM Memo WHERE id IN",
        );
        query_builder.push_tuples(keys, |mut separated, key| {
            separated.push_bind(key.0.clone());
        });
        let query = query_builder.build_query_as::<Memo>();

        Ok(query
            .fetch(&self.pool)
            .map_ok(|memo| (MemoId(memo.id.clone()), memo))
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
    memo_id: String,
    contents: String,
    updated_at: DateTime<Utc>,
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
    memo_ids: &[String],
) -> sqlx::Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("DELETE Memo WHERE id IN");
    query_builder.push_tuples(memo_ids, |mut separated, id| {
        separated.push_bind(id.clone());
    });
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

pub(crate) async fn transfer_memo(
    executor: impl SqliteExecutor<'_>,
    memo_ids: &[String],
    dest_book_id: String,
) -> sqlx::Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("UPDATE Memo WHERE id IN");
    query_builder.push_tuples(memo_ids, |mut separated, id| {
        separated.push_bind(id.clone());
    });
    query_builder.push("SET bookId = ?");
    let query = query_builder.build();

    query.bind(dest_book_id).execute(executor).await?;
    Ok(())
}

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct MemoTag {
    #[sqlx(rename = "memoId")]
    memo_id: String,
    symbol: String,
    prop: Option<String>,
}

impl MemoTag {
    pub(crate) fn new(memo_id: String, symbol: String, prop: Option<String>) -> MemoTag {
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
        query_builder.push_tuples(keys, |mut separated, key| {
            separated.push_bind(key.0.clone());
        });
        let query = query_builder.build_query_as::<MemoTag>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, tag| {
                let MemoTag {
                    memo_id,
                    symbol,
                    prop,
                } = tag;
                let tag_string = prop
                    .clone()
                    .map_or(symbol.clone(), |prop| format!("{symbol}:{prop}",));
                accum
                    .entry(MemoId(memo_id.clone()))
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
