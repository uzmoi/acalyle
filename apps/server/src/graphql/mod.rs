mod book;
mod memo;
mod node;
mod schema;

use async_graphql::{Request, Response};
pub use schema::graphql_schema;

pub async fn graphql(request: impl Into<Request>) -> Response {
    graphql_schema().execute(request).await
}
