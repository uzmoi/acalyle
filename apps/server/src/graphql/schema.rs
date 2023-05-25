use super::{
    book::{BookMutation, BookQuery},
    memo::{MemoMutation, MemoQuery},
    node::NodeQuery,
};
use crate::db::loader::{SqliteLoader, SqliteTagLoader};
use async_graphql::{dataloader::DataLoader, EmptySubscription, MergedObject, Schema};
use sqlx::SqlitePool;

#[derive(MergedObject, Default)]
pub struct Query(NodeQuery, BookQuery, MemoQuery);

#[derive(MergedObject, Default)]
pub struct Mutation(BookMutation, MemoMutation);

pub type GraphQLSchema = Schema<Query, Mutation, EmptySubscription>;

pub fn graphql_schema(pool: SqlitePool) -> GraphQLSchema {
    let loader = DataLoader::new(SqliteLoader { pool: pool.clone() }, tokio::spawn);
    let tag_loader = DataLoader::new(SqliteTagLoader { pool: pool.clone() }, tokio::spawn);
    let schema = Schema::build(Query::default(), Mutation::default(), EmptySubscription)
        .data(pool)
        .data(loader)
        .data(tag_loader)
        .finish();
    schema
}
