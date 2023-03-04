import { css } from "@linaria/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { BookList } from "~/widgets/book/BookList";
import type { booksQuery } from "./__generated__/booksQuery.graphql";

export const BookListPage: React.FC = () => {
    const queryRef = useLazyLoadQuery<booksQuery>(
        graphql`
            query booksQuery(
                $count: Int!
                $cursor: String
                $query: String
                $orderBy: BookSortOrder
                $order: SortOrder
            ) {
                ...BookListFragment
            }
        `,
        { count: 8 },
    );

    return (
        <main
            className={css`
                padding: 2em;
            `}
        >
            <BookList queryRef={queryRef} />
        </main>
    );
};
