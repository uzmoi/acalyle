use async_graphql::{EmptySubscription, MergedObject, Schema};

use super::{
    book::{BookMutation, BookQuery},
    memo::{MemoMutation, MemoQuery},
    node::NodeQuery,
};

#[derive(MergedObject, Default)]
pub struct Query(NodeQuery, BookQuery, MemoQuery);

#[derive(MergedObject, Default)]
pub struct Mutation(BookMutation, MemoMutation);

pub fn graphql_schema() -> Schema<Query, Mutation, EmptySubscription> {
    Schema::build(Query::default(), Mutation::default(), EmptySubscription).finish()
}
