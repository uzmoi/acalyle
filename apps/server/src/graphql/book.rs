use super::{
    cursor::Cursor,
    node::{connection, connection_args, NodeType},
};
use crate::{
    db::{
        book::{
            delete_book, fetch_books, insert_book, Book, BookHandle, BookId, BookSortOrderBy,
            BookTag,
        },
        loader::{SqliteLoader, SqliteTagLoader},
        memo::{fetch_memos, Memo, MemoId, MemoSortOrderBy},
    },
    query::{NodeListQuery, SortOrder},
};
use async_graphql::{
    connection::{self, Connection},
    dataloader::DataLoader,
    Context, Object, Result, Upload, ID,
};
use chrono::{DateTime, Utc};
use sqlx::SqlitePool;
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
                let books = fetch_books(pool, query).await?;

                let connection = connection(books, limit, first, last, BookConnectionExtend {});
                Ok::<_, async_graphql::Error>(connection)
            },
        )
        .await
    }
}

struct BookConnectionExtend;

#[Object]
impl BookConnectionExtend {
    #[allow(unreachable_code)]
    async fn total_count(&self) -> i32 {
        todo!()
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
        self.thumbnail.clone()
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
                let memos = fetch_memos(pool, query).await?;

                let connection = connection(memos, limit, first, last, MemoConnectionExtend {});
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

struct MemoConnectionExtend;

#[Object]
impl MemoConnectionExtend {
    #[allow(unreachable_code)]
    async fn total_count(&self) -> i32 {
        todo!()
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
    // TODO thumbnailに対応
    async fn create_book(
        &self,
        ctx: &Context<'_>,
        title: String,
        description: Option<String>,
        _thumbnail: Option<Upload>,
    ) -> Result<Book> {
        let id = Uuid::new_v4();
        let now = Utc::now();

        let book = Book {
            id: BookId(id.to_string()),
            handle: None,
            title,
            description: description.unwrap_or_default(),
            thumbnail: format!("color:hsl({}deg,80%,40%)", rand::random::<f32>() * 360f32),
            created_at: now,
            updated_at: now,
            settings: Vec::new(),
        };

        let pool = ctx.data::<SqlitePool>()?;

        insert_book(pool, [book.clone()]).await?;

        Ok(book)
    }
    #[allow(unreachable_code)]
    async fn update_book_title(&self, _id: ID, _title: String) -> Book {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn update_book_thumbnail(&self, _id: ID, _thumbnail: Option<Upload>) -> Book {
        todo!()
    }
    #[allow(unreachable_code)]
    async fn upload_resource(
        &self,
        _book_id: ID,
        _file_name: String,
        _file: Option<Upload>,
    ) -> String {
        todo!()
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
