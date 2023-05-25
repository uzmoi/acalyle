use acalyle_server::graphql;
use sqlx::SqlitePool;
use std::io::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
    let schema = graphql::graphql_schema(pool.clone());
    std::fs::write("./data/schema.graphql", schema.sdl())
}
