use acalyle_server::graphql;
use sqlx::SqlitePool;
use std::{fs, io};

#[tokio::main]
async fn main() -> io::Result<()> {
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
    let schema = graphql::graphql_schema(pool.clone());
    fs::write("./schema.graphql", schema.sdl())
}
