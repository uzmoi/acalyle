use crate::db::{
    book::{Book, BookId},
    loader::SqliteLoader,
    memo::{Memo, MemoId},
};
use async_graphql::{
    connection::{Connection, Edge},
    dataloader::DataLoader,
    Context, Interface, Object, ObjectType, Result, ID,
};

use super::cursor::Cursor;

#[derive(Default)]
pub(super) struct NodeQuery;

#[Object]
impl NodeQuery {
    async fn node(&self, ctx: &Context<'_>, id: ID) -> Result<Option<Node>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;

        if let Ok(memo_id) = MemoId::try_from(id.clone()) {
            let memo = loader.load_one(memo_id).await?;
            return Ok(memo.map(Node::Memo));
        }
        if let Ok(book_id) = BookId::try_from(id) {
            let book = loader.load_one(book_id).await?;
            return Ok(book.map(Node::Book));
        }

        Ok(None)
    }
}

#[derive(Interface)]
#[graphql(field(name = "id", type = "ID"))]
pub(super) enum Node {
    Book(Book),
    Memo(Memo),
}

pub(super) trait NodeType<O> {
    fn cursor(&self, order_by: O) -> Cursor;
}

pub(super) fn connection_args(
    after: Option<Cursor>,
    before: Option<Cursor>,
    first: Option<usize>,
    last: Option<usize>,
) -> (usize, Option<(String, bool)>, Option<(String, bool)>) {
    let forward_pagination = first.map(|first| (first, after, None));
    let backward_pagination = last.map(|last| (last, None, before));
    let (limit, lt_cursor, gt_cursor) = forward_pagination
        .xor(backward_pagination)
        .unwrap_or((0, None, None));
    (
        limit,
        lt_cursor.map(|lt_cursor| (lt_cursor.0, false)),
        gt_cursor.map(|gt_cursor| (gt_cursor.0, false)),
    )
}

pub(super) fn connection<O: Copy, Node: ObjectType + NodeType<O>, ConnectionFields: ObjectType>(
    nodes: Vec<Node>,
    limit: usize,
    first: Option<usize>,
    last: Option<usize>,
    order_by: O,
    additional_fields: ConnectionFields,
) -> Connection<Cursor, Node, ConnectionFields> {
    let has_previous_page = last.map_or(false, |last| last < nodes.len());
    let has_next_page = first.map_or(false, |first| first < nodes.len());
    let mut connection =
        Connection::with_additional_fields(has_previous_page, has_next_page, additional_fields);
    let edges = nodes
        .into_iter()
        .take(limit)
        .map(|node| Edge::new(node.cursor(order_by), node));
    connection.edges.extend(edges);
    connection
}
