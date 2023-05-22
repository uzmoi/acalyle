use super::loader::{SqliteLoader, SqliteTagLoader};
use async_graphql::{
    async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt, Result,
};
use chrono::{DateTime, Utc};
use sqlx::SqliteExecutor;
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash)]
pub(crate) struct BookId(pub String);

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct BookData {
    pub id: String,
    pub handle: Option<String>,
    pub title: String,
    pub description: String,
    pub thumbnail: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub settings: Vec<u8>,
}

#[async_trait]
impl Loader<BookId> for SqliteLoader {
    type Value = BookData;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[BookId]) -> Result<HashMap<BookId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(
            "SELECT id
                , handle
                , thumbnail
                , title
                , description
                , createdAt
                , updatedAt
                , settings
            FROM Book WHERE id IN",
        );
        query_builder.push_tuples(keys, |mut separated, key| {
            separated.push_bind(key.0.clone());
        });
        let query = query_builder.build_query_as::<BookData>();

        Ok(query
            .fetch(&self.pool)
            .map_ok(|book| (BookId(book.id.clone()), book))
            .map_err(Arc::new)
            .try_collect()
            .await?)
    }
}

pub(crate) async fn insert_book(
    executor: impl SqliteExecutor<'_>,
    books: impl IntoIterator<Item = BookData>,
) -> Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("INSERT INTO Book(memoId, symbol, prop) ");
    query_builder.push_values(books, |mut separated, book| {
        separated
            .push_bind(book.id)
            .push_bind(book.handle)
            .push_bind(book.title)
            .push_bind(book.description)
            .push_bind(book.thumbnail)
            .push_bind(book.created_at)
            .push_bind(book.updated_at)
            .push_bind(book.settings);
    });
    let query = query_builder.build();
    query.execute(executor).await?;
    Ok(())
}

pub(crate) async fn delete_book(
    executor: impl SqliteExecutor<'_>,
    book_ids: &[String],
) -> sqlx::Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("DELETE Book WHERE id IN");
    query_builder.push_tuples(book_ids, |mut separated, id| {
        separated.push_bind(id.clone());
    });
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

#[derive(sqlx::FromRow, Clone)]
struct BookTag {
    book_id: String,
    symbol: String,
}

#[async_trait]
impl Loader<BookId> for SqliteTagLoader {
    type Value = Vec<String>;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[BookId]) -> Result<HashMap<BookId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new("SELECT Memo.bookId, Tag.symbol FROM Tag, Memo WHERE Memo.id = Tag.memoId AND Memo.bookId IN");
        query_builder.push_tuples(keys, |mut separated, key| {
            separated.push_bind(key.0.clone());
        });
        let query = query_builder.build_query_as::<BookTag>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, tag| {
                accum
                    .entry(BookId(tag.book_id.clone()))
                    .or_insert_with(Vec::new)
                    .push(tag.symbol.clone());
                accum
            }))
    }
}
