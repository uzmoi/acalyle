use acalyle_server::{db::init::create_tables, server::serve};
use sqlx::{Result, SqlitePool};
use std::{fs::OpenOptions, io, path::Path};

fn touch(path: impl AsRef<Path>) -> io::Result<()> {
    OpenOptions::new()
        .create(true)
        .write(true)
        .open(path)
        .map(|_| ())
}

#[tokio::main]
async fn main() -> Result<()> {
    let db_file_path = "data/dev.db";
    touch(db_file_path).unwrap();

    let pool = SqlitePool::connect(&format!("sqlite:{db_file_path}")).await?;
    if create_tables(&pool).await.is_ok() {
        println!("Initialized {db_file_path}.");
    };

    serve(&([127, 0, 0, 1], 4323).into(), pool).await;

    Ok(())
}
