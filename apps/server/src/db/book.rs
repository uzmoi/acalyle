use super::{
    loader::{SqliteLoader, SqliteTagLoader},
    memo::MemoId,
    query::{push_cursor_query, push_ending_query},
    util::QueryBuilderExt,
};
use crate::query::{NodeListQuery, OrdOp, QueryToken};
use async_graphql::{
    async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt, Result, ID,
};
use chrono::{DateTime, Utc};
use sqlx::{QueryBuilder, Sqlite, SqliteExecutor};
use std::{collections::HashMap, fmt, str::FromStr, sync::Arc};
use uuid::Uuid;

#[derive(Clone, PartialEq, Eq, Hash, sqlx::Type)]
#[sqlx(transparent)]
pub(crate) struct BookId(String);

impl BookId {
    pub fn new() -> BookId {
        let id = Uuid::new_v4();
        BookId(id.to_string())
    }
    pub fn to_id(&self) -> ID {
        let mut id = String::with_capacity(self.0.len() + 1);
        id.push('B');
        id.push_str(&self.0);
        ID(id)
    }
}

impl fmt::Display for BookId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

impl TryFrom<ID> for BookId {
    type Error = String;

    fn try_from(value: ID) -> Result<Self, Self::Error> {
        if value.len() == 0 {
            return Err("invalid id".to_string());
        }
        let first = value.as_bytes()[0] as char;
        if first == 'B' {
            let id = value[1..].to_string();
            Ok(BookId(id))
        } else {
            Err("invalid id".to_string())
        }
    }
}

#[derive(Clone, PartialEq, Eq, Hash, sqlx::Type)]
#[sqlx(transparent)]
pub(crate) struct BookHandle(pub String);

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct Book {
    pub id: BookId,
    pub handle: Option<BookHandle>,
    pub title: String,
    pub description: String,
    pub thumbnail: String,
    #[sqlx(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[sqlx(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
    pub settings: Vec<u8>,
}

pub(crate) struct BookQuery {
    pub filter: BookFilter,
    pub meta: HashMap<String, Vec<String>>,
}

impl BookQuery {
    pub fn new(query: &str) -> BookQuery {
        let mut meta: HashMap<String, Vec<String>> = HashMap::new();
        let mut filter = BookFilter::new();
        for qt in QueryToken::parse(query) {
            match qt.key {
                Some(key) => {
                    if qt.negate { &mut meta } else { &mut meta }
                        .entry(key.to_string())
                        .or_default()
                        .push(qt.value.to_string());
                }
                None if qt.negate => {
                    filter.negate_contents.push(qt.value.to_string());
                }
                None => {
                    filter.contents.push(qt.value.to_string());
                }
            }
        }
        BookQuery { filter, meta }
    }
}

#[derive(Clone, Copy, Default, strum::Display)]
pub(crate) enum BookSortOrderBy {
    #[strum(serialize = "title")]
    Title,
    #[strum(serialize = "createdAt")]
    Created,
    #[strum(serialize = "updatedAt")]
    #[default]
    Updated,
}

impl FromStr for BookSortOrderBy {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "title" => Ok(BookSortOrderBy::Title),
            "created" => Ok(BookSortOrderBy::Created),
            "updated" => Ok(BookSortOrderBy::Updated),
            _ => Err("invalid book order".to_string()),
        }
    }
}

#[derive(Default, Clone)]
pub struct BookFilter {
    contents: Vec<String>,
    negate_contents: Vec<String>,
}

impl BookFilter {
    fn new() -> BookFilter {
        BookFilter::default()
    }
}

fn push_book_filter_query(query_builder: &mut QueryBuilder<'_, Sqlite>, filter: BookFilter) {
    query_builder.push("(");

    for filter in filter.contents {
        let filter = format!("%{}%", filter);
        query_builder.push("(");
        query_builder.push("title LIKE ").push_bind(filter.clone());
        query_builder.push(" OR ");
        query_builder.push("description LIKE ").push_bind(filter);
        query_builder.push(")");
        query_builder.push(" AND ");
    }

    query_builder.push("1=1");
    query_builder.push(") ");
}

pub(crate) async fn fetch_books(
    executor: impl SqliteExecutor<'_>,
    query: NodeListQuery<BookFilter, BookSortOrderBy>,
) -> Result<Vec<Book>> {
    let mut query_builder = sqlx::QueryBuilder::new(SELECT_BOOK_QUERY);
    query_builder.push(" WHERE ");

    let order_column = &query.order_by.to_string();

    if let Some((lt_cursor, eq)) = query.lt_cursor {
        push_cursor_query(
            &mut query_builder,
            order_column,
            OrdOp::lt(eq),
            &lt_cursor,
            "Book",
        );
        query_builder.push(" AND ");
    }
    if let Some((gt_cursor, eq)) = query.gt_cursor {
        push_cursor_query(
            &mut query_builder,
            order_column,
            OrdOp::gt(eq),
            &gt_cursor,
            "Book",
        );
        query_builder.push(" AND ");
    }

    push_book_filter_query(&mut query_builder, query.filter);

    push_ending_query(
        &mut query_builder,
        &[(order_column, query.order)],
        query.limit,
        query.offset,
    );

    let query = query_builder.build_query_as::<Book>();

    Ok(query.fetch_all(executor).await?)
}

pub(crate) async fn count_books(
    executor: impl SqliteExecutor<'_>,
    filter: BookFilter,
) -> Result<i32> {
    let mut query_builder = sqlx::QueryBuilder::new("SELECT COUNT(*) FROM Book WHERE ");

    push_book_filter_query(&mut query_builder, filter);

    let query = query_builder.build_query_as::<(i32,)>();

    Ok(query.fetch_one(executor).await?.0)
}

const SELECT_BOOK_QUERY: &str = {
    "SELECT id, handle, thumbnail, title, description, createdAt, updatedAt, settings FROM Book"
};

#[async_trait]
impl Loader<BookId> for SqliteLoader {
    type Value = Book;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[BookId]) -> Result<HashMap<BookId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(SELECT_BOOK_QUERY);
        query_builder.push(" WHERE id IN ");
        query_builder.push_bind_values(keys);
        let query = query_builder.build_query_as::<Book>();

        Ok(query
            .fetch(&self.pool)
            .map_ok(|book| (book.id.clone(), book))
            .try_collect()
            .await?)
    }
}

#[async_trait]
impl Loader<BookHandle> for SqliteLoader {
    type Value = Book;
    type Error = Arc<sqlx::Error>;

    async fn load(
        &self,
        keys: &[BookHandle],
    ) -> Result<HashMap<BookHandle, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(SELECT_BOOK_QUERY);
        query_builder.push(" WHERE handle IN ");
        query_builder.push_bind_values(keys);
        let query = query_builder.build_query_as::<Book>();

        Ok(query
            .fetch(&self.pool)
            .map_ok(|book| {
                let handle = book.handle.clone().unwrap();
                (handle, book)
            })
            .try_collect()
            .await?)
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

pub(crate) async fn update_book_handle(
    executor: impl SqliteExecutor<'_>,
    book_id: &BookId,
    handle: Option<String>,
) -> sqlx::Result<()> {
    sqlx::query("UPDATE Book SET handle = ? WHERE id = ?")
        .bind(handle)
        .bind(book_id)
        .execute(executor)
        .await?;
    Ok(())
}

pub(crate) async fn update_book_description(
    executor: impl SqliteExecutor<'_>,
    book_id: &BookId,
    description: String,
) -> sqlx::Result<()> {
    sqlx::query("UPDATE Book SET description = ? WHERE id = ?")
        .bind(description)
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
                    .or_default()
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
                    .or_default()
                    .push(tag.prop.clone());
                accum
            }))
    }
}
