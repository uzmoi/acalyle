use crate::db::loader::SqliteLoader;
use async_graphql::{async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt};
use chrono::{DateTime, Utc};
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash)]
pub(crate) struct BookId(pub String);

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct BookData {
    id: String,
    pub handle: Option<String>,
    pub title: String,
    pub description: String,
    pub thumbnail: String,
    pub created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
    settings: Vec<u8>,
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
