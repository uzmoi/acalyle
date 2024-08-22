import { acalyle } from "~/app/main";
import { derived } from "~/lib/derived";
import type { ID } from "~/lib/graphql";
import { memoizeBuilder } from "~/lib/memoize-builder";
import type { PromiseLoaderW } from "~/lib/promise-loader";
import { createQueryStore } from "~/lib/query-store";
import BookQuery from "./graphql/book.graphql";
import ChangeBookDescriptionMutation from "./graphql/change-book-description.graphql";
import ChangeBookHandleMutation from "./graphql/change-book-handle.graphql";
import ChangeBookTitleMutation from "./graphql/change-book-title.graphql";
import CreateBookMutation from "./graphql/create-book.graphql";

/** @package */
export type BookRef = ID | `@${string}`;

/** @package */
export const bookRefOf = (book: Book): BookRef =>
    book.handle ? `@${book.handle}` : book.id;

/** @package */
export type Book = {
    id: ID;
    handle: string | null;
    title: string;
    description: string;
    thumbnail: string;
    tags: readonly string[];
};

/** @package */
export const bookStore = /* #__PURE__ */ createQueryStore(
    async (bookId: ID): Promise<Book | null> => {
        const { data } = await acalyle.net.gql(BookQuery, { bookId });
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
    async (handle: string): Promise<ID | null> => {
        if (handle === "") {
            return null;
        }
        const { data } = await acalyle.net.gql(BookQuery, { handle });
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

export const createBook = async (title: string, description: string) => {
    const { data } = await acalyle.net.gql(
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

export const changeBookTitle = async (bookId: ID, title: string) => {
    const { data } = await acalyle.net.gql(ChangeBookTitleMutation, {
        bookId,
        title,
    });

    const store = bookStore(bookId);

    if (data.updateBookTitle) {
        const book: Book = {
            ...data.updateBookTitle,
            handle: data.updateBookTitle.handle ?? null,
            tags: [],
        };
        store.resolve(book);
    } else {
        store.resolve(null);
    }
};

export const changeBookHandle = async (bookId: ID, handle: string | null) => {
    const { data } = await acalyle.net.gql(ChangeBookHandleMutation, {
        bookId,
        handle,
    });

    const store = bookStore(bookId);

    if (data.updateBookHandle) {
        const book: Book = {
            ...data.updateBookHandle,
            handle: data.updateBookHandle.handle ?? null,
            tags: [],
        };
        store.resolve(book);
    } else {
        store.resolve(null);
    }
};

export const changeBookDescription = async (
    bookId: ID,
    description: string,
) => {
    const { data } = await acalyle.net.gql(ChangeBookDescriptionMutation, {
        bookId,
        description,
    });

    const store = bookStore(bookId);

    if (data.updateBookDescription) {
        const book: Book = {
            ...data.updateBookDescription,
            handle: data.updateBookDescription.handle ?? null,
            tags: [],
        };
        store.resolve(book);
    } else {
        store.resolve(null);
    }
};
