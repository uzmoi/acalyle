import { gql } from "graphql-tag";
import type {
    GqlBookQuery,
    GqlBookQueryVariables,
    GqlCreateBookMutation,
    GqlCreateBookMutationVariables,
    Scalars,
} from "~/__generated__/graphql";
import { derived } from "~/lib/derived";
import { memoizeBuilder } from "~/lib/memoize-builder";
import type { PromiseLoaderW } from "~/lib/promise-loader";
import { createQueryStore } from "~/lib/query-store";
import { acalyle } from "../app/main";
import type { Book } from "./book-connection";

const BookQuery = /* #__PURE__ */ gql`
    query Book($bookId: ID, $handle: String) {
        book(id: $bookId, handle: $handle) {
            id
            handle
            title
            description
            thumbnail
            createdAt
            tags
        }
    }
`;

export const bookStore = /* #__PURE__ */ createQueryStore(
    async (bookId: Scalars["ID"]): Promise<Book | null> => {
        const { data } = await acalyle.net.gql<
            GqlBookQuery,
            GqlBookQueryVariables
        >(BookQuery, { bookId });
        if (data.book == null) {
            return null;
        }
        const book = {
            ...data.book,
            handle: data.book.handle ?? null,
        };
        if (book.handle != null) {
            bookHandleStore(book.handle).resolve(book.id);
        }
        return book;
    },
);

export const bookHandleStore = /* #__PURE__ */ createQueryStore(
    async (handle: string): Promise<Scalars["ID"] | null> => {
        if (handle === "") {
            return null;
        }
        const { data } = await acalyle.net.gql<
            GqlBookQuery,
            GqlBookQueryVariables
        >(BookQuery, { handle });
        if (data.book == null) {
            return null;
        }
        const book = { ...data.book, handle };
        bookStore(book.id).resolve(book);
        return book.id;
    },
);

export const handleBookStore = /* #__PURE__ */ memoizeBuilder(
    (_, handle: string) =>
        derived((get): PromiseLoaderW<Book | null> => {
            const bookIdLoader = get(bookHandleStore(handle));
            if (
                bookIdLoader.status !== "fulfilled" ||
                bookIdLoader.value == null
            ) {
                return bookIdLoader as
                    | Exclude<typeof bookIdLoader, { status: "fulfilled" }>
                    | { status: "fulfilled"; value: null };
            }
            return get(bookStore(bookIdLoader.value));
        }),
);

const CreateBookMutation = /* #__PURE__ */ gql`
    mutation CreateBook(
        $title: String!
        $description: String!
        $thumbnail: Upload
    ) {
        createBook(
            title: $title
            description: $description
            thumbnail: $thumbnail
        ) {
            id
            handle
            title
            description
            thumbnail
            createdAt
        }
    }
`;

export const createBook = async (title: string, description: string) => {
    const { data } = await acalyle.net.gql<
        GqlCreateBookMutation,
        GqlCreateBookMutationVariables
    >(
        CreateBookMutation,
        { title, description, thumbnail: null },
        // { "variables.thumbnail": thumbnail },
    );
    const book: Book = {
        ...data.createBook,
        handle: data.createBook.handle ?? null,
        tags: [],
    };
    bookStore(book.id).resolve(book);
    return book;
};
