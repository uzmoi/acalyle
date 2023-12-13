use super::{
    book::BookId,
    loader::{SqliteLoader, SqliteTagLoader},
    query::{push_cursor_query, push_ending_query},
    util::QueryBuilderExt,
};
use crate::query::{Filter, NodeListQuery, OrdOp, QueryToken};
use async_graphql::{
    async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt, Result, ID,
};
use chrono::{DateTime, Utc};
use sqlx::{QueryBuilder, Sqlite, SqliteExecutor};
use std::{collections::HashMap, fmt, str::FromStr, sync::Arc};
use uuid::Uuid;

#[derive(Clone, PartialEq, Eq, Hash, sqlx::Type)]
#[sqlx(transparent)]
pub(crate) struct MemoId(String);

impl MemoId {
    pub fn new() -> MemoId {
        let id = Uuid::new_v4();
        MemoId(id.to_string())
    }
    pub fn to_id(&self) -> ID {
        let mut id = String::with_capacity(self.0.len() + 1);
        id.push('N');
        id.push_str(&self.0);
        ID(id)
    }
}

impl fmt::Display for MemoId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

impl TryFrom<ID> for MemoId {
    type Error = String;

    fn try_from(value: ID) -> Result<Self, Self::Error> {
        if value.len() == 0 {
            return Err("invalid id".to_string());
        }
        let first = value.as_bytes()[0] as char;
        if first == 'N' {
            let id = value[1..].to_string();
            Ok(MemoId(id))
        } else {
            Err("invalid id".to_string())
        }
    }
}

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

impl Memo {
    pub fn new(book_id: BookId, created_at: DateTime<Utc>) -> Memo {
        Memo {
            id: MemoId::new(),
            contents: String::new(),
            created_at,
            updated_at: created_at,
            book_id,
        }
    }
}

pub(crate) struct MemoQuery {
    pub filter: MemoFilter,
    pub meta: HashMap<String, Vec<Filter<String>>>,
}

impl MemoQuery {
    pub fn new(book_id: BookId, query: &str) -> MemoQuery {
        let mut meta: HashMap<String, Vec<Filter<String>>> = HashMap::new();
        let mut filter = MemoFilter::new(book_id);
        for qt in QueryToken::parse(query) {
            if qt.key.as_ref().unwrap_or(&qt.value).starts_with(['#', '@']) {
                match qt.key {
                    Some(key) if qt.negate => filter.negate_tag_symbols.push(key.to_string()),
                    Some(key) => filter.tag_symbols.push(key.to_string()),
                    None if qt.negate => filter.negate_tag_symbols.push(qt.value.to_string()),
                    None => filter.tag_symbols.push(qt.value.to_string()),
                };
            } else {
                let value = Filter {
                    negate: qt.negate,
                    value: qt.value.to_string(),
                };
                if let Some(key) = qt.key {
                    meta.entry(key.to_string()).or_default().push(value);
                } else {
                    filter.contents.push(value);
                }
            }
        }
        MemoQuery { filter, meta }
    }
}

#[derive(Clone, Copy, Default, strum::Display)]
pub(crate) enum MemoSortOrderBy {
    #[strum(serialize = "createdAt")]
    Created,
    #[strum(serialize = "updatedAt")]
    #[default]
    Updated,
}

impl FromStr for MemoSortOrderBy {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "created" => Ok(MemoSortOrderBy::Created),
            "updated" => Ok(MemoSortOrderBy::Updated),
            _ => Err("invalid memo order".to_string()),
        }
    }
}

#[derive(Clone)]
pub struct MemoFilter {
    book_id: BookId,
    tag_symbols: Vec<String>,
    negate_tag_symbols: Vec<String>,
    contents: Vec<Filter<String>>,
}

impl MemoFilter {
    pub(crate) fn new(book_id: BookId) -> MemoFilter {
        MemoFilter {
            book_id,
            tag_symbols: Vec::new(),
            negate_tag_symbols: Vec::new(),
            contents: Vec::new(),
        }
    }
}

fn push_memo_filter_query(query_builder: &mut QueryBuilder<'_, Sqlite>, filter: MemoFilter) {
    query_builder.push("(");

    query_builder.push("bookId = ").push_bind(filter.book_id);
    query_builder.push(" AND ");

    if !filter.tag_symbols.is_empty() {
        query_builder
            .push("id IN (")
            .push("SELECT memoId FROM Tag WHERE symbol IN ")
            .push_bind_values(filter.tag_symbols)
            .push(")");
        query_builder.push(" AND ");
    }
    if !filter.negate_tag_symbols.is_empty() {
        query_builder
            .push("id NOT IN (")
            .push("SELECT memoId FROM Tag WHERE symbol IN ")
            .push_bind_values(filter.negate_tag_symbols)
            .push(")");
        query_builder.push(" AND ");
    }

    for filter in filter.contents {
        let pat = format!("%{}%", filter.value);
        query_builder
            .push(if filter.negate {
                "contents NOT LIKE "
            } else {
                "contents LIKE "
            })
            .push_bind(pat);
        query_builder.push(" AND ");
    }

    query_builder.push("1=1");
    query_builder.push(") ");
}

pub(crate) async fn fetch_memos(
    executor: impl SqliteExecutor<'_>,
    query: NodeListQuery<MemoFilter, MemoSortOrderBy>,
) -> Result<Vec<Memo>> {
    let mut query_builder = sqlx::QueryBuilder::new(
        "SELECT id, contents, createdAt, updatedAt, bookId FROM Memo WHERE ",
    );

    let order_column = &query.order_by.to_string();

    if let Some((lt_cursor, eq)) = query.lt_cursor {
        push_cursor_query(
            &mut query_builder,
            order_column,
            OrdOp::lt(eq),
            &lt_cursor,
            "Memo",
        );
        query_builder.push(" AND ");
    }
    if let Some((gt_cursor, eq)) = query.gt_cursor {
        push_cursor_query(
            &mut query_builder,
            order_column,
            OrdOp::gt(eq),
            &gt_cursor,
            "Memo",
        );
        query_builder.push(" AND ");
    }

    push_memo_filter_query(&mut query_builder, query.filter);

    push_ending_query(
        &mut query_builder,
        &[(order_column, query.order)],
        query.limit,
        query.offset,
    );

    let query = query_builder.build_query_as::<Memo>();

    Ok(query.fetch_all(executor).await?)
}

pub(crate) async fn count_memos(
    executor: impl SqliteExecutor<'_>,
    filter: MemoFilter,
) -> Result<i32> {
    let mut query_builder = sqlx::QueryBuilder::new("SELECT COUNT(*) FROM Memo WHERE ");

    push_memo_filter_query(&mut query_builder, filter);

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
    pub(crate) fn parse(memo_id: MemoId, tag: &str) -> Option<MemoTag> {
        // cspell:ignore splitn
        let mut tag = tag.splitn(2, ':');
        Some(MemoTag {
            memo_id,
            symbol: tag.next()?.to_string(),
            prop: tag.next().map(|prop| prop.to_string()),
        })
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
