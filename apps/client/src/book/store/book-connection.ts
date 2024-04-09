import { acalyle } from "~/app/main";
import { createConnectionAtom } from "~/lib/connection";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { bookStore } from "./book";
import BookPaginationQuery from "./graphql/book-pagination.graphql";

/** @package */
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
