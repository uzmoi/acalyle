use super::{
    loader::{SqliteLoader, SqliteTagLoader},
    memo::MemoId,
    util::QueryBuilderExt,
};
use crate::query::NodeListQuery;
use async_graphql::{async_trait::async_trait, dataloader::Loader, Result};
use chrono::{DateTime, Utc};
use sqlx::SqliteExecutor;
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash, sqlx::Type)]
#[sqlx(transparent)]
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
pub(crate) struct Book {
    pub id: BookId,
    pub handle: Option<String>,
    pub title: String,
    pub description: String,
    pub thumbnail: String,
    #[sqlx(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[sqlx(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
    pub settings: Vec<u8>,
}

#[derive(strum::Display)]
pub(crate) enum BookSortOrderBy {
    #[strum(serialize = "title")]
    Title,
    #[strum(serialize = "createdAt")]
    Created,
    #[strum(serialize = "updatedAt")]
    Updated,
}

pub(crate) async fn fetch_books(
    executor: impl SqliteExecutor<'_>,
    query: NodeListQuery<String, BookSortOrderBy>,
) -> Result<Vec<Book>> {
    let mut query_builder = sqlx::QueryBuilder::new(
        "SELECT id, handle, thumbnail, title, description, createdAt, updatedAt, settings
        FROM Book WHERE ",
    );

    // cursor
    if let Some((lt_cursor, eq)) = query.lt_cursor {
        query_builder.push(&query.order_by);
        query_builder.push(if eq { " <=" } else { " <" });
        query_builder.push(" (SELECT ");
        query_builder.push(&query.order_by);
        query_builder.push(" FROM Book WHERE id = ");
        query_builder.push_bind(lt_cursor);
        query_builder.push(") AND ");
    }
    if let Some((gt_cursor, eq)) = query.gt_cursor {
        query_builder.push(&query.order_by);
        query_builder.push(if eq { " >=" } else { " >" });
        query_builder.push(" (SELECT ");
        query_builder.push(&query.order_by);
        query_builder.push(" FROM Book WHERE id = ");
        query_builder.push_bind(gt_cursor);
        query_builder.push(") AND ");
    }
    // filter
    let filter = format!("%{}%", query.filter);
    query_builder.push("(title LIKE ");
    query_builder.push_bind(&filter);
    query_builder.push(" OR description LIKE ");
    query_builder.push_bind(&filter);
    query_builder.push(") ");

    let mut separated = query_builder.separated(" ");
    separated.push("ORDER BY");
    separated.push(query.order_by);
    separated.push(query.order);
    separated.push("LIMIT");
    separated.push_bind(query.limit);
    separated.push("OFFSET");
    separated.push_bind(query.offset);

    let query = query_builder.build_query_as::<Book>();

    Ok(query.fetch_all(executor).await?)
}

pub(crate) async fn count_books(executor: impl SqliteExecutor<'_>, filter: String) -> Result<i32> {
    let mut query_builder = sqlx::QueryBuilder::new("SELECT COUNT(*) FROM Book WHERE ");

    // filter
    let filter = format!("%{}%", filter);
    query_builder.push("(title LIKE ");
    query_builder.push_bind(&filter);
    query_builder.push(" OR description LIKE ");
    query_builder.push_bind(&filter);
    query_builder.push(") ");

    let query = query_builder.build_query_as::<(i32,)>();

    Ok(query.fetch_one(executor).await?.0)
}

#[async_trait]
impl Loader<BookHandle> for SqliteLoader {
    type Value = Book;
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
        query_builder.push_bind_values(ids);
        query_builder.push("OR handle IN");
        let handles = keys.iter().filter_map(BookHandle::handle);
        query_builder.push_bind_values(handles);
        let query = query_builder.build_query_as::<Book>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, book| {
                let id = BookHandle::Id(book.id.0.clone());
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
    books: impl IntoIterator<Item = Book>,
) -> Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new(
        "INSERT INTO Book(id
        , handle
        , title
        , description
        , thumbnail
        , createdAt
        , updatedAt
        , settings) ",
    );
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
    book_id: &BookId,
    updated_at: &DateTime<Utc>,
) -> Result<()> {
    sqlx::query("UPDATE Book SET updatedAt = ? WHERE id = ?")
        .bind(updated_at)
        .bind(book_id)
        .execute(executor)
        .await?;
    Ok(())
}

pub(crate) async fn update_book_by_memo_id(
    executor: impl SqliteExecutor<'_>,
    memo_ids: impl IntoIterator<Item = MemoId>,
    updated_at: &DateTime<Utc>,
) -> Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("UPDATE Book SET updatedAt = ");
    query_builder.push_bind(updated_at);
    query_builder.push("FROM Memo WHERE Book.id = Memo.bookId AND Memo.id IN");
    query_builder.push_bind_values(memo_ids);
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

pub(crate) async fn update_book_title(
    executor: impl SqliteExecutor<'_>,
    book_id: &BookId,
    title: String,
) -> sqlx::Result<()> {
    sqlx::query("UPDATE Book SET title = ? WHERE id = ?")
        .bind(title)
        .bind(book_id)
        .execute(executor)
        .await?;
    Ok(())
}

pub(crate) async fn delete_book(
    executor: impl SqliteExecutor<'_>,
    book_ids: &[BookId],
) -> sqlx::Result<()> {
    let mut query_builder = sqlx::QueryBuilder::new("DELETE Book WHERE id IN");
    query_builder.push_bind_values(book_ids);
    let query = query_builder.build();

    query.execute(executor).await?;
    Ok(())
}

#[derive(sqlx::FromRow, Clone, PartialEq, Eq, Hash)]
pub(crate) struct BookTag {
    #[sqlx(rename = "bookId")]
    book_id: BookId,
    symbol: String,
}

impl BookTag {
    pub fn new(book_id: BookId, symbol: String) -> BookTag {
        BookTag { book_id, symbol }
    }
}

#[async_trait]
impl Loader<BookId> for SqliteTagLoader {
    type Value = Vec<String>;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[BookId]) -> Result<HashMap<BookId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new("SELECT Memo.bookId, Tag.symbol FROM Tag, Memo WHERE Memo.id = Tag.memoId AND Memo.bookId IN");
        query_builder.push_bind_values(keys);
        let query = query_builder.build_query_as::<BookTag>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, tag| {
                accum
                    .entry(tag.book_id.clone())
                    .or_insert_with(Vec::new)
                    .push(tag.symbol.clone());
                accum
            }))
    }
}

#[derive(sqlx::FromRow, Clone)]
struct BookMemoTag {
    #[sqlx(rename = "bookId")]
    book_id: BookId,
    symbol: String,
    prop: String,
}

#[async_trait]
impl Loader<BookTag> for SqliteTagLoader {
    type Value = Vec<String>;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[BookTag]) -> Result<HashMap<BookTag, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(
            "SELECT Memo.bookId, Tag.symbol, Tag.prop
            FROM Tag, Memo
            WHERE Memo.id = Tag.memoId
            AND Tag.prop NOT NULL
            AND (Memo.bookId, Tag.symbol) IN",
        );
        query_builder.push_tuples(keys, |mut separated, key| {
            separated.push_bind(&key.book_id).push_bind(&key.symbol);
        });
        let query = query_builder.build_query_as::<BookMemoTag>();

        Ok(query
            .fetch_all(&self.pool)
            .await?
            .iter()
            .fold(HashMap::new(), |mut accum, tag| {
                accum
                    .entry(BookTag {
                        book_id: tag.book_id.clone(),
                        symbol: tag.symbol.clone(),
                    })
                    .or_insert_with(Vec::new)
                    .push(tag.prop.clone());
                accum
            }))
    }
}
