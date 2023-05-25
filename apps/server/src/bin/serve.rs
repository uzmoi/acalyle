use acalyle_server::server::serve;
use sqlx::SqlitePool;
use std::io::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();

    serve(&([127, 0, 0, 1], 4323).into(), pool).await;

    Ok(())
}
