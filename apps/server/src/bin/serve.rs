use acalyle_server::{db::init::create_tables, server::serve};
use sqlx::{Result, SqlitePool};

#[tokio::main]
async fn main() -> Result<()> {
    let pool = SqlitePool::connect("sqlite::memory:").await?;
    create_tables(&pool).await?;

    serve(&([127, 0, 0, 1], 4323).into(), pool).await;

    Ok(())
}
