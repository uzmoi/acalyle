use super::{book::Book, memo::Memo};
use async_graphql::{Interface, Object, ID};

#[derive(Default)]
pub(super) struct NodeQuery;

#[allow(unreachable_code)]
#[Object]
impl NodeQuery {
    async fn node(&self, _id: ID) -> Option<Node> {
        todo!()
    }
}

#[derive(Interface)]
#[graphql(field(name = "id", type = "ID"))]
pub(super) enum Node {
    Book(Book),
    Memo(Memo),
}
