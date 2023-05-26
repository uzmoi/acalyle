use sqlx::SqlitePool;

pub async fn create_tables(pool: &SqlitePool) -> sqlx::Result<()> {
    sqlx::query(
        "CREATE TABLE Book (
            id TEXT NOT NULL PRIMARY KEY,
            handle TEXT,
            thumbnail TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME NOT NULL,
            settings BLOB NOT NULL
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE Memo (
            id TEXT NOT NULL PRIMARY KEY,
            contents TEXT NOT NULL,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME NOT NULL,
            bookId TEXT NOT NULL,
            CONSTRAINT Memo_bookId_f_key FOREIGN KEY (bookId) REFERENCES Book (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )",
    )
    .execute(pool)
    .await?;

    sqlx::query(
        "CREATE TABLE Tag (
            memoId TEXT NOT NULL,
            symbol TEXT NOT NULL,
            prop TEXT,
            PRIMARY KEY (memoId, symbol),
            CONSTRAINT MemoTag_memoId_f_key FOREIGN KEY (memoId) REFERENCES Memo (id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
        )",
    )
    .execute(pool)
    .await?;

    Ok(())
}
