use crate::db::book::BookId;
use std::{
    io,
    path::{Path, PathBuf},
};
use tokio::fs::{write, File};

fn resolve_resource(id: impl AsRef<Path>, file_name: impl AsRef<Path>) -> PathBuf {
    Path::new("data/resource").join(id).join(file_name)
}

pub async fn read_resource(id: String, file_name: String) -> io::Result<File> {
    let file = File::open(resolve_resource(id, file_name)).await?;
    Ok(file)
}

pub(crate) async fn write_resource(
    id: &BookId,
    file_name: String,
    contents: impl AsRef<[u8]>,
) -> io::Result<String> {
    write(resolve_resource(&id.to_string(), &file_name), contents).await?;

    Ok(format!("{}/{}", id, file_name))
}
