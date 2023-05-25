use crate::graphql::{graphql_schema, GraphQLSchema};
use async_graphql::http::GraphiQLSource;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{response, routing, Extension, Router};
use sqlx::SqlitePool;
use std::net::SocketAddr;

async fn graphql_handler(schema: Extension<GraphQLSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

// cspell:word graphiql
async fn graphiql_handler() -> impl response::IntoResponse {
    response::Html(GraphiQLSource::build().endpoint("/").finish())
}

pub async fn serve(addr: &SocketAddr, pool: SqlitePool) {
    let schema = graphql_schema(pool);

    let app = Router::new()
        .route("/", routing::get(graphiql_handler).post(graphql_handler))
        .layer(Extension(schema));

    axum::Server::bind(addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
