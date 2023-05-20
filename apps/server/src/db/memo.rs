use crate::db::loader::SqliteLoader;
use async_graphql::{async_trait::async_trait, dataloader::Loader, futures_util::TryStreamExt};
use chrono::{DateTime, Utc};
use std::{collections::HashMap, sync::Arc};

#[derive(Clone, PartialEq, Eq, Hash)]
pub(crate) struct MemoId(pub String);

#[derive(sqlx::FromRow, Clone)]
pub(crate) struct MemoData {
    id: String,
    pub contents: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub book_id: String,
}

#[async_trait]
impl Loader<MemoId> for SqliteLoader {
    type Value = MemoData;
    type Error = Arc<sqlx::Error>;

    async fn load(&self, keys: &[MemoId]) -> Result<HashMap<MemoId, Self::Value>, Self::Error> {
        let mut query_builder = sqlx::QueryBuilder::new(
            "SELECT id, contents, createdAt, updatedAt, bookId FROM Memo WHERE id IN",
        );
        query_builder.push_tuples(keys, |mut separated, key| {
            separated.push_bind(key.0);
        });
        let query = query_builder.build_query_as::<MemoData>();

        Ok(query
            .fetch(&self.pool)
            .map_ok(|memo| (MemoId(memo.id), memo))
            .map_err(Arc::new)
            .try_collect()
            .await?)
    }
}
