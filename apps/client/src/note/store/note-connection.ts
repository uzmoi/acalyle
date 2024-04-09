import { assert } from "emnorst";
import type { ID } from "~/__generated__/graphql";
import { acalyle } from "~/app/main";
import { createConnectionAtom } from "~/lib/connection";
import { memoizeBuilder } from "~/lib/memoize-builder";
import NotePaginationQuery from "./graphql/note-pagination.graphql";
import { noteStore } from "./note";

/** @package */
export const noteConnection = /* #__PURE__ */ memoizeBuilder(
    (_, bookId: ID, query: string) =>
        createConnectionAtom(
            async connectionAtom => {
                const { data } = await acalyle.net.gql(NotePaginationQuery, {
                    bookId,
                    count: 32,
                    cursor: connectionAtom.get().endCursor,
                    query,
                });
                assert.nonNullable(data.book);
                return data.book.memos;
            },
            note => {
                noteStore(note.id).resolve(note);
            },
        ),
);
