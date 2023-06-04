use std::{io, path::Path};
use tokio::fs::File;

pub async fn read_resource(
    name: impl AsRef<Path>,
    file_name: impl AsRef<Path>,
) -> io::Result<File> {
    let path = Path::new("data/resource").join(name).join(file_name);
    let file = File::open(path).await?;
    Ok(file)
}
