use crate::db::book::BookId;
use std::{io, path::Path};
use tokio::fs::{write, File};

pub async fn read_resource(id: String, file_name: String) -> io::Result<File> {
    let path = Path::new("data/resource").join(id).join(file_name);
    let file = File::open(path).await?;
    Ok(file)
}

pub(crate) async fn write_resource(
    id: &BookId,
    file_name: String,
    contents: impl AsRef<[u8]>,
) -> io::Result<String> {
    let path = Path::new("data/resource").join(&id.0).join(&file_name);
    write(path, contents).await?;

    Ok(format!("{}/{}", id.0, file_name))
}
