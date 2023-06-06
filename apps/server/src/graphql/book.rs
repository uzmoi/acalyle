use super::{
    cursor::Cursor,
    node::{connection, connection_args, NodeType},
};
use crate::{
    db::{
        book::{
            count_books, delete_book, fetch_books, insert_book, Book, BookHandle, BookId,
            BookSortOrderBy, BookTag,
        },
        loader::{SqliteLoader, SqliteTagLoader},
        memo::{count_memos, fetch_memos, Memo, MemoId, MemoSortOrderBy},
    },
    query::{NodeListQuery, SortOrder},
    resource::write_resource,
};
use async_graphql::{
    connection::{self, Connection},
    dataloader::DataLoader,
    Context, Object, Result, Upload, ID,
};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
use std::io::Read;
use uuid::Uuid;

#[derive(Default)]
pub(super) struct BookQuery;

#[Object]
impl BookQuery {
    // TODO bookByHandle
    async fn book(
        &self,
        ctx: &Context<'_>,
        id: Option<ID>,
        handle: Option<String>,
    ) -> Result<Option<Book>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let handle = id
            .map(|id| BookHandle::Id(id.0))
            .or_else(|| handle.map(BookHandle::Handle))
            .ok_or_else(|| async_graphql::Error::new("id or handle is required"))?;
        Ok(loader.load_one(handle).await?)
    }
    async fn books(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
        query: Option<String>,
    ) -> Result<Connection<Cursor, Book, BookConnectionExtend>> {
        let pool = ctx.data::<SqlitePool>()?;

        connection::query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                let (limit, lt_cursor, gt_cursor) = connection_args(after, before, first, last);

                let query = NodeListQuery {
                    filter: query.unwrap_or_default(),
                    order: SortOrder::Desc,
                    order_by: BookSortOrderBy::Updated,
                    lt_cursor,
                    gt_cursor,
                    offset: 0,
                    limit: (limit + 1) as i32,
                };
                let filter = query.filter.clone();
                let books = fetch_books(pool, query).await?;

                let connection =
                    connection(books, limit, first, last, BookConnectionExtend { filter });
                Ok::<_, async_graphql::Error>(connection)
            },
        )
        .await
    }
}

struct BookConnectionExtend {
    filter: String,
}

#[Object]
impl BookConnectionExtend {
    async fn total_count(&self, ctx: &Context<'_>) -> Result<i32> {
        let pool = ctx.data::<SqlitePool>()?;
        let filter = self.filter.clone();
        count_books(pool, filter).await
    }
}

impl NodeType for Book {
    fn id(&self) -> String {
        self.id.0.clone()
    }
}

#[Object]
impl Book {
    pub(super) async fn id(&self) -> ID {
        ID(self.id.0.clone())
    }
    async fn handle(&self) -> Option<String> {
        self.handle.clone()
    }
    async fn title(&self) -> String {
        self.title.clone()
    }
    async fn description(&self) -> String {
        self.description.clone()
    }
    async fn thumbnail(&self) -> String {
        if self.thumbnail == "#image" {
            format!("{}/thumbnail.png", self.id.0)
        } else {
            self.thumbnail.clone()
        }
    }
    async fn created_at(&self) -> DateTime<Utc> {
        self.created_at
    }
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Option<Memo>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let memo = loader.load_one(MemoId(id.0)).await?;
        Ok(memo.filter(|memo| memo.book_id == self.id))
    }
    async fn memos(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
        query: Option<String>,
    ) -> Result<Connection<Cursor, Memo, MemoConnectionExtend>> {
        let pool = ctx.data::<SqlitePool>()?;

        connection::query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                let (limit, lt_cursor, gt_cursor) = connection_args(after, before, first, last);

                let query = NodeListQuery {
                    filter: (self.id.clone(), query.unwrap_or_default()),
                    order: SortOrder::Desc,
                    order_by: MemoSortOrderBy::Updated,
                    lt_cursor,
                    gt_cursor,
                    offset: 0,
                    limit: (limit + 1) as i32,
                };
                let filter = query.filter.clone();
                let memos = fetch_memos(pool, query).await?;

                let connection =
                    connection(memos, limit, first, last, MemoConnectionExtend { filter });
                Ok::<_, async_graphql::Error>(connection)
            },
        )
        .await
    }
    async fn tags(&self, ctx: &Context<'_>) -> Result<Vec<String>> {
        let loader = ctx.data::<DataLoader<SqliteTagLoader>>()?;
        let tags = loader.load_one(self.id.clone()).await?;
        Ok(tags.unwrap_or_default())
    }
    async fn tag_props(&self, ctx: &Context<'_>, symbol: String) -> Result<Vec<String>> {
        let loader = ctx.data::<DataLoader<SqliteTagLoader>>()?;
        let props = loader
            .load_one(BookTag::new(self.id.clone(), symbol))
            .await?;
        Ok(props.unwrap_or_default())
    }
    #[allow(unreachable_code)]
    async fn resources(&self) -> Vec<String> {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn settings(&self) -> BookSetting {
        todo!()
    }
}

struct MemoConnectionExtend {
    filter: (BookId, String),
}

#[Object]
impl MemoConnectionExtend {
    async fn total_count(&self, ctx: &Context<'_>) -> Result<i32> {
        let pool = ctx.data::<SqlitePool>()?;
        let filter = self.filter.clone();
        count_memos(pool, filter).await
    }
}

struct BookSetting;

#[Object]
impl BookSetting {
    #[allow(unreachable_code)]
    async fn extensions(&self) -> Vec<String> {
        todo!()
    }
}

#[derive(Default)]
pub(super) struct BookMutation;

#[Object]
impl BookMutation {
    async fn create_book(
        &self,
        ctx: &Context<'_>,
        title: String,
        description: Option<String>,
        thumbnail: Option<Upload>,
    ) -> Result<Book> {
        let pool = ctx.data::<SqlitePool>()?;
        let id = Uuid::new_v4();
        let now = Utc::now();

        let book = Book {
            id: BookId(id.to_string()),
            handle: None,
            title,
            description: description.unwrap_or_default(),
            thumbnail: if thumbnail.is_some() {
                String::from("#image")
            } else {
                let hue = rand::random::<f32>() * 360f32;
                format!("color:hsl({hue}deg,80%,40%)")
            },
            created_at: now,
            updated_at: now,
            settings: Vec::new(),
        };

        if let Some(thumbnail) = thumbnail {
            let mut buffer = Vec::new();
            thumbnail.value(ctx)?.into_read().read_to_end(&mut buffer)?;
            let file_name = String::from("thumbnail.png");
            write_resource(&book.id, file_name, buffer).await?;
        }

        insert_book(pool, [book.clone()]).await?;

        Ok(book)
    }
    #[allow(unreachable_code)]
    async fn update_book_title(&self, _id: ID, _title: String) -> Book {
        todo!()
    }
    async fn update_book_thumbnail(
        &self,
        ctx: &Context<'_>,
        id: ID,
        thumbnail: Upload,
    ) -> Result<Option<Book>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let book = loader.load_one(BookHandle::Id(id.to_string())).await?;
        if book.is_none() {
            return Ok(None);
        }

        let mut buffer = Vec::new();
        thumbnail.value(ctx)?.into_read().read_to_end(&mut buffer)?;
        let file_name = String::from("thumbnail.png");
        write_resource(&BookId(id.0), file_name, buffer).await?;

        Ok(book)
    }
    async fn upload_resource(
        &self,
        ctx: &Context<'_>,
        book_id: ID,
        file_name: String,
        file: Upload,
    ) -> Result<Option<String>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let book = loader.load_one(BookHandle::Id(book_id.to_string())).await?;
        if book.is_none() {
            return Ok(None);
        }

        let mut buffer = Vec::new();
        file.value(ctx)?.into_read().read_to_end(&mut buffer)?;
        let resource_ref = write_resource(&BookId(book_id.0), file_name, buffer).await?;

        Ok(Some(resource_ref))
    }
    #[allow(unreachable_code)]
    async fn rename_tag(&self, _book_id: ID, _new_symbol: String, _old_symbol: String) -> String {
        todo!()
    }
    async fn delete_book(&self, ctx: &Context<'_>, id: ID) -> Result<ID> {
        let pool = ctx.data::<SqlitePool>()?;
        delete_book(pool, &[BookId(id.to_string())]).await?;
        Ok(id)
    }
}
