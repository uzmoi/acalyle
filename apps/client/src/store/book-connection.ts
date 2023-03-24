import { gql } from "graphql-tag";
import {
    type GqlBookListPaginationQuery,
    type GqlBookListPaginationQueryVariables,
    GqlBookSortOrder,
    GqlSortOrder,
} from "~/__generated__/graphql";
import { createConnectionAtom } from "~/lib/connection";
import { net } from "~/store/net";

const BookListPagination = gql`
    query BookListPagination(
        $count: Int!
        $cursor: String
        $query: String!
        $orderBy: BookSortOrder!
        $order: SortOrder!
    ) {
        books(
            first: $count
            after: $cursor
            query: $query
            orderBy: $orderBy
            order: $order
        ) {
            edges {
                node {
                    id
                    title
                    description
                    thumbnail
                    tags
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`;

export type Book = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    tags: readonly string[];
};

export const bookConnection = createConnectionAtom<Book>(
    async connectionAtom => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { graphql } = net.get()!;
        const { data } = await graphql<
            GqlBookListPaginationQuery,
            GqlBookListPaginationQueryVariables
        >(BookListPagination, {
            count: 32,
            cursor: connectionAtom.get().endCursor,
            query: "",
            orderBy: GqlBookSortOrder.LastUpdated,
            order: GqlSortOrder.Desc,
        });
        return data.books;
    },
);
