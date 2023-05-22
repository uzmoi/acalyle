use super::loader::{SqliteLoader, SqliteTagLoader};
use async_graphql::{async_trait::async_trait, dataloader::Loader, Result};
use chrono::{DateTime, Utc};
use sqlx::SqliteExecutor;
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash)]
pub(crate) struct BookId(pub String);

#[derive(Clone, PartialEq, Eq, Hash)]
pub(crate) enum BookHandle {
    Id(String),
    Handle(String),
}

impl BookHandle {
    fn id(&self) -> Option<&String> {
        if let BookHandle::Id(id) = self {
            Some(id)
        } else {
            None
        }
    }
    fn handle(&self) -> Option<&String> {
        if let BookHandle::Handle(id) = self {
            Some(id)
        } else {
            None
        }
    }
}

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
impl Loader<BookHandle> for SqliteLoader {
    type Value = BookData;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[BookHandle],
    ) -> Result<HashMap<BookHandle, Self::Value>, Self::Error> {
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
        let ids = keys.iter().filter_map(BookHandle::id);
        query_builder.push_tuples(ids, |mut separated, key| {
            separated.push_bind(key.clone());
        });
        query_builder.push("OR handle IN");
        let handles = keys.iter().filter_map(BookHandle::handle);
        query_builder.push_tuples(handles.clone(), |mut separated, key| {
            separated.push_bind(key.clone());
        });
        let query = query_builder.build_query_as::<BookData>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, book| {
                let id = BookHandle::Id(book.id.clone());
                accum.entry(id).or_insert(book.clone());
                if let Some(handle) = &book.handle {
                    let handle = BookHandle::Handle(handle.clone());
                    accum.entry(handle).or_insert(book.clone());
                }
                accum
            }))
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

pub(crate) async fn update_book(
    executor: impl SqliteExecutor<'_>,
    book_id: String,
    updated_at: DateTime<Utc>,
) -> Result<()> {
    sqlx::query("UPDATE Book SET updatedAt = ? WHERE id = ?")
        .bind(updated_at)
        .bind(book_id)
        .execute(executor)
        .await?;
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
