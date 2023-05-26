use async_graphql::connection::CursorType;
use base64::{engine::general_purpose::STANDARD, DecodeError, Engine};

pub(super) struct Cursor(pub String);

impl CursorType for Cursor {
    type Error = DecodeError;

    fn decode_cursor(s: &str) -> std::result::Result<Self, Self::Error> {
        let v = STANDARD.decode(s)?;
        let cursor = String::from_utf8_lossy(&v).into_owned();
        Ok(Cursor(cursor))
    }

    fn encode_cursor(&self) -> String {
        STANDARD.encode(self.0.clone())
    }
}
