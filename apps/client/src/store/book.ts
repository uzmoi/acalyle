import { gql } from "graphql-tag";
import type {
    GqlBookQuery,
    GqlBookQueryVariables,
    GqlChangeBookDescriptionMutation,
    GqlChangeBookDescriptionMutationVariables,
    GqlChangeBookHandleMutation,
    GqlChangeBookHandleMutationVariables,
    GqlChangeBookTitleMutation,
    GqlChangeBookTitleMutationVariables,
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

const ChangeBookTitleMutation = /* #__PURE__ */ gql`
    mutation ChangeBookTitle($bookId: ID!, $title: String!) {
        updateBookTitle(id: $bookId, title: $title) {
            id
            handle
            title
            description
            thumbnail
            createdAt
        }
    }
`;

export const changeBookTitle = async (bookId: Scalars["ID"], title: string) => {
    const { data } = await acalyle.net.gql<
        GqlChangeBookTitleMutation,
        GqlChangeBookTitleMutationVariables
    >(ChangeBookTitleMutation, { bookId, title });

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

const ChangeBookHandleMutation = /* #__PURE__ */ gql`
    mutation ChangeBookHandle($bookId: ID!, $handle: String) {
        updateBookHandle(id: $bookId, handle: $handle) {
            id
            handle
            title
            description
            thumbnail
            createdAt
        }
    }
`;

export const changeBookHandle = async (
    bookId: Scalars["ID"],
    handle: string | null,
) => {
    const { data } = await acalyle.net.gql<
        GqlChangeBookHandleMutation,
        GqlChangeBookHandleMutationVariables
    >(ChangeBookHandleMutation, { bookId, handle });

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

const ChangeBookDescriptionMutation = /* #__PURE__ */ gql`
    mutation ChangeBookDescription($bookId: ID!, $description: String!) {
        updateBookDescription(id: $bookId, description: $description) {
            id
            handle
            title
            description
            thumbnail
            createdAt
        }
    }
`;

export const changeBookDescription = async (
    bookId: Scalars["ID"],
    description: string,
) => {
    const { data } = await acalyle.net.gql<
        GqlChangeBookDescriptionMutation,
        GqlChangeBookDescriptionMutationVariables
    >(ChangeBookDescriptionMutation, { bookId, description });

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
