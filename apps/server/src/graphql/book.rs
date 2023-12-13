use super::{
    cursor::Cursor,
    node::{connection, connection_args, NodeType},
};
use crate::{
    db::{
        book::{
            count_books, delete_book, fetch_books, insert_book, update_book,
            update_book_description, update_book_handle, update_book_title, Book, BookHandle,
            BookId, BookSortOrderBy, BookTag,
        },
        loader::{SqliteLoader, SqliteTagLoader},
        memo::{count_memos, fetch_memos, Memo, MemoFilter, MemoId, MemoQuery},
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
        match (id, handle) {
            (Some(id), _) => {
                let id = BookId::try_from(id)?;
                Ok(loader.load_one(id).await?)
            }
            (None, Some(handle)) => {
                let handle = BookHandle(handle);
                Ok(loader.load_one(handle).await?)
            }
            _ => Err(async_graphql::Error::new("id or handle is required")),
        }
    }
    async fn books(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
        #[graphql(default)] query: String,
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
                    filter: query,
                    order: SortOrder::Desc,
                    order_by: BookSortOrderBy::Updated,
                    lt_cursor,
                    gt_cursor,
                    offset: 0,
                    limit: (limit + 1) as i32,
                };
                let filter = query.filter.clone();
                let order_by = query.order_by;
                let books = fetch_books(pool, query).await?;

                let connection = connection(
                    books,
                    limit,
                    first,
                    last,
                    order_by,
                    BookConnectionExtend { filter },
                );
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

impl NodeType<BookSortOrderBy> for Book {
    fn cursor(&self, _order_by: BookSortOrderBy) -> Cursor {
        Cursor(self.id.to_string())
    }
}

#[Object]
impl Book {
    pub(super) async fn id(&self) -> ID {
        self.id.to_id()
    }
    async fn handle(&self) -> Option<&String> {
        self.handle.as_ref().map(|handle| &handle.0)
    }
    async fn title(&self) -> &str {
        &self.title
    }
    async fn description(&self) -> &str {
        &self.description
    }
    async fn thumbnail(&self) -> String {
        if self.thumbnail == "#image" {
            format!("{}/thumbnail.png", self.id)
        } else {
            self.thumbnail.clone()
        }
    }
    async fn created_at(&self) -> DateTime<Utc> {
        self.created_at
    }
    async fn memo(&self, ctx: &Context<'_>, id: ID) -> Result<Option<Memo>> {
        let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
        let memo_id = MemoId::try_from(id)?;
        let memo = loader.load_one(memo_id).await?;
        Ok(memo.filter(|memo| memo.book_id == self.id))
    }
    async fn memos(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
        #[graphql(default)] query: String,
    ) -> Result<Connection<Cursor, Memo, MemoConnectionExtend>> {
        let pool = ctx.data::<SqlitePool>()?;

        connection::query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                let (limit, lt_cursor, gt_cursor) = connection_args(after, before, first, last);

                let query = MemoQuery::new(self.id.clone(), &query);
                let filter = query.filter.clone();
                let order_by = query
                    .meta
                    .get("order")
                    .and_then(|orders| orders.last()?.parse().ok())
                    .unwrap_or_default();
                let query = NodeListQuery {
                    filter: query.filter,
                    order: SortOrder::Desc,
                    order_by,
                    lt_cursor,
                    gt_cursor,
                    offset: 0,
                    limit: (limit + 1) as i32,
                };
                let memos = fetch_memos(pool, query).await?;

                let connection = connection(
                    memos,
                    limit,
                    first,
                    last,
                    order_by,
                    MemoConnectionExtend { filter },
                );
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
    filter: MemoFilter,
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

async fn get_book(ctx: &Context<'_>, id: BookId) -> Result<Option<Book>> {
    let loader = ctx.data::<DataLoader<SqliteLoader>>()?;
    Ok(loader.load_one(id).await?)
}

async fn write_upload_resource(
    book_id: &BookId,
    file_name: String,
    mut file: impl Read,
) -> Result<String> {
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    Ok(write_resource(book_id, file_name, buffer).await?)
}

#[derive(Default)]
pub(super) struct BookMutation;

#[Object]
impl BookMutation {
    async fn create_book(
        &self,
        ctx: &Context<'_>,
        #[graphql(validator(min_length = 1, max_length = 256))] title: String,
        #[graphql(default, validator(max_length = 1024))] description: String,
        thumbnail: Option<Upload>,
    ) -> Result<Book> {
        let pool = ctx.data::<SqlitePool>()?;
        let now = Utc::now();

        let book = Book {
            id: BookId::new(),
            handle: None,
            title,
            description,
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
            let file_name = String::from("thumbnail.png");
            let file = thumbnail.value(ctx)?.into_read();
            write_upload_resource(&book.id, file_name, file).await?;
        }

        insert_book(pool, [book.clone()]).await?;

        Ok(book)
    }
    async fn update_book_title(
        &self,
        ctx: &Context<'_>,
        id: ID,
        #[graphql(validator(min_length = 1, max_length = 256))] title: String,
    ) -> Result<Option<Book>> {
        let pool = ctx.data::<SqlitePool>()?;
        let book_id = BookId::try_from(id)?;
        let now = Utc::now();

        update_book_title(pool, &book_id, title).await?;
        update_book(pool, &book_id, &now).await?;

        get_book(ctx, book_id).await
    }
    async fn update_book_handle(
        &self,
        ctx: &Context<'_>,
        id: ID,
        #[graphql(validator(min_length = 1, max_length = 256, regex = "^[[:word:]-]+$"))]
        handle: Option<String>,
    ) -> Result<Option<Book>> {
        let pool = ctx.data::<SqlitePool>()?;
        let book_id = BookId::try_from(id)?;
        let now = Utc::now();

        update_book_handle(pool, &book_id, handle).await?;
        update_book(pool, &book_id, &now).await?;

        get_book(ctx, book_id).await
    }
    async fn update_book_description(
        &self,
        ctx: &Context<'_>,
        id: ID,
        #[graphql(validator(max_length = 1024))] description: String,
    ) -> Result<Option<Book>> {
        let pool = ctx.data::<SqlitePool>()?;
        let book_id = BookId::try_from(id)?;
        let now = Utc::now();

        update_book_description(pool, &book_id, description).await?;
        update_book(pool, &book_id, &now).await?;

        get_book(ctx, book_id).await
    }
    async fn update_book_thumbnail(
        &self,
        ctx: &Context<'_>,
        id: ID,
        thumbnail: Upload,
    ) -> Result<Option<Book>> {
        let book_id = BookId::try_from(id)?;
        let file_name = String::from("thumbnail.png");
        let file = thumbnail.value(ctx)?.into_read();
        write_upload_resource(&book_id, file_name, file).await?;
        get_book(ctx, book_id).await
    }
    async fn upload_resource(
        &self,
        ctx: &Context<'_>,
        book_id: ID,
        file_name: String,
        file: Upload,
    ) -> Result<Option<String>> {
        let book_id = BookId::try_from(book_id)?;
        let book = get_book(ctx, book_id.clone()).await?;
        if book.is_none() {
            return Ok(None);
        }

        let file = file.value(ctx)?.into_read();
        let resource_ref = write_upload_resource(&book_id, file_name, file).await?;

        Ok(Some(resource_ref))
    }
    #[allow(unreachable_code)]
    async fn rename_tag(&self, _book_id: ID, _new_symbol: String, _old_symbol: String) -> String {
        todo!()
    }
    async fn delete_book(&self, ctx: &Context<'_>, id: ID) -> Result<ID> {
        let pool = ctx.data::<SqlitePool>()?;
        let book_id = BookId::try_from(id.clone())?;
        delete_book(pool, &[book_id]).await?;
        Ok(id)
    }
}
