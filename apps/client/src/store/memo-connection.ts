import { assert } from "emnorst";
import type { ID } from "~/__generated__/graphql";
import { createConnectionAtom } from "~/lib/connection";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { memoStore } from "~/store/memo";
import { acalyle } from "../app/main";
import MemoPaginationQuery from "./memo-pagination.graphql";

export type Memo = {
    id: string;
    contents: string;
    tags: readonly string[];
    createdAt: string;
    updatedAt: string;
};

export const memoConnection = /* #__PURE__ */ memoizeBuilder(
    (_, bookId: ID, query: string) =>
        createConnectionAtom(
            async connectionAtom => {
                const { data } = await acalyle.net.gql(MemoPaginationQuery, {
                    bookId,
                    count: 32,
                    cursor: connectionAtom.get().endCursor,
                    query,
                });
                assert.nonNullable(data.book);
                return data.book.memos;
            },
            memo => {
                memoStore(memo.id).resolve(memo);
            },
        ),
);
