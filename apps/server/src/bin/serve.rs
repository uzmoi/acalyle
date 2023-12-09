use acalyle_server::{
    db::init::{create_tables, foreign_keys},
    graphql,
    server::serve,
};
use sqlx::SqlitePool;
use std::{fs::OpenOptions, io, path::Path};

fn touch(path: impl AsRef<Path>) -> io::Result<()> {
    OpenOptions::new()
        .create(true)
        .write(true)
        .open(path)
        .map(|_| ())
}

const DEFAULT_DB_URL: &str = "sqlite:data/dev.db";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let init = std::env::args().any(|arg| arg == "--init");

    let db_url = std::env::var("DATABASE_URL").or_else(|_| -> io::Result<_> {
        if init {
            touch(DEFAULT_DB_URL)?;
        }
        Ok(DEFAULT_DB_URL.to_string())
    })?;

    let pool = SqlitePool::connect(&db_url).await?;
    if init {
        create_tables(&pool).await?;
        println!("Initialized {db_url}.");
    }

    foreign_keys(&pool).await?;

    let graphql_schema = graphql::graphql_schema(pool);

    serve(&([127, 0, 0, 1], 4323).into(), graphql_schema).await;

    Ok(())
}
