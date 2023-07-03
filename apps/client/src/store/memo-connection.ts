import { assert } from "emnorst";
import { gql } from "graphql-tag";
import type {
    GqlMemoListPaginationQuery,
    GqlMemoListPaginationQueryVariables,
    Scalars,
} from "~/__generated__/graphql";
import { createConnectionAtom } from "~/lib/connection";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { memoStore } from "~/store/memo";
import { acalyle } from "../app/main";

const MemoListPagination = gql`
    query MemoListPagination(
        $bookId: ID!
        $count: Int!
        $cursor: String
        $query: String!
    ) {
        book(id: $bookId) {
            memos(first: $count, after: $cursor, query: $query) {
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

export const memoConnection = memoizeBuilder(
    (_, bookId: Scalars["ID"], query: string) =>
        createConnectionAtom(
            async connectionAtom => {
                const { data } = await acalyle.net.gql<
                    GqlMemoListPaginationQuery,
                    GqlMemoListPaginationQueryVariables
                >(MemoListPagination, {
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
