import { graphql, useLazyLoadQuery } from "react-relay";
import { Link } from "../../router-react";
import { BookList } from "../data/BookList";
import { booksQuery } from "./__generated__/booksQuery.graphql";

export const BookListPage: React.FC = () => {
    const queryRef = useLazyLoadQuery<booksQuery>(graphql`
        query booksQuery($count: Int!, $cursor: String) {
            ...BookListFragment
        }
    `, { count: 8 });

    return (
        <div>
            <Link pattern="books/new">new</Link>
            <BookList queryRef={queryRef} />
        </div>
    );
};
