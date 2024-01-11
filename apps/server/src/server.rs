use crate::{graphql::GraphQLSchema, resource::read_resource};
use async_graphql::http::GraphiQLSource;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::{
    body::StreamBody,
    extract::{Path, Query},
    http::StatusCode,
    response, routing, Extension, Router,
};
use serde::Deserialize;
use std::net::SocketAddr;
use tokio_util::io::ReaderStream;

async fn graphql_handler(schema: Extension<GraphQLSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[derive(Deserialize)]
struct Endpoint {
    endpoint: Option<String>,
}

async fn graphiql_handler(req: Query<Endpoint>) -> impl response::IntoResponse {
    let endpoint = req.0.endpoint.as_deref().unwrap_or("/");
    response::Html(GraphiQLSource::build().endpoint(endpoint).finish())
}

async fn resource_handler(
    Path((id, file_name)): Path<(String, String)>,
) -> Result<impl response::IntoResponse, StatusCode> {
    let file = read_resource(id, file_name).await.map_err(|err| {
        if err.kind() == std::io::ErrorKind::NotFound {
            StatusCode::NOT_FOUND
        } else {
            StatusCode::INTERNAL_SERVER_ERROR
        }
    })?;

    let stream = ReaderStream::new(file);
    let body = StreamBody::new(stream);

    Ok(body)
}

pub async fn serve(addr: &SocketAddr, schema: GraphQLSchema) -> Result<(), axum::BoxError> {
    let app = Router::new()
        .route("/", routing::get(graphiql_handler).post(graphql_handler))
        .route("/:id/:file", routing::get(resource_handler))
        .layer(Extension(schema));

    Ok(axum::Server::bind(addr)
        .serve(app.into_make_service())
        .await?)
}
