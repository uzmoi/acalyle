import { assert } from "emnorst";
import { gql } from "graphql-tag";
import type { WritableAtom } from "nanostores";
import type {
    GqlMemoListPaginationQuery,
    GqlMemoListPaginationQueryVariables,
} from "~/__generated__/graphql";
import { type Connection, createConnectionAtom } from "~/lib/connection";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { net } from "~/store/net";

const MemoListPagination = gql`
    query MemoListPagination($bookId: ID!, $count: Int!, $cursor: String) {
        book(id: $bookId) {
            memos(first: $count, after: $cursor) {
                edges {
                    node {
                        id
                        contents
                        tags
                        createdAt
                        updatedAt
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`;

export type Memo = {
    id: string;
    contents: string;
    tags: readonly string[];
    createdAt: string;
    updatedAt: string;
};

export const memoConnection = memoizeBuilder<WritableAtom<Connection<Memo>>>(
    (_, bookId: string) => {
        return createConnectionAtom<Memo>(async connectionAtom => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const { graphql } = net.get()!;
            const { data } = await graphql<
                GqlMemoListPaginationQuery,
                GqlMemoListPaginationQueryVariables
            >(MemoListPagination, {
                bookId,
                count: 32,
                cursor: connectionAtom.get().endCursor,
            });
            assert.nonNullable(data.book);
            return data.book.memos;
        });
    },
);
