import type { ID } from "~/__generated__/graphql";
import { createConnectionAtom } from "~/lib/connection";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { bookStore } from "~/store/book";
import { acalyle } from "../app/main";
import BookPaginationQuery from "./book-pagination.graphql";

export type Book = {
    id: ID;
    handle: string | null;
    title: string;
    description: string;
    thumbnail: string;
    tags: readonly string[];
};

export const bookConnection = /* #__PURE__ */ memoizeBuilder(
    (_id, query: string) =>
        createConnectionAtom(
            async connectionAtom => {
                const { data } = await acalyle.net.gql(BookPaginationQuery, {
                    count: 32,
                    cursor: connectionAtom.get().endCursor,
                    query, // `orderby:updated order:desc ${query}`
                });
                return data.books;
            },
            book => {
                bookStore(book.id).resolve({
                    ...book,
                    handle: book.handle ?? null,
                });
            },
        ),
);
