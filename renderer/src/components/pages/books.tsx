import { VFC } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { BookList } from "../data/BookList";
import { booksQuery } from "./__generated__/booksQuery.graphql";

export const BookListPage: VFC = () => {
    const queryRef = useLazyLoadQuery<booksQuery>(graphql`
        query booksQuery($count: Int!, $cursor: String) {
            ...BookListFragment
        }
    `, { count: 8 });

    return (
        <div>
            <button>new</button>
            <BookList queryRef={queryRef} />
        </div>
    );
};
