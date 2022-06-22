import { graphql, useLazyLoadQuery } from "react-relay";
import { useLocation } from "../../router-react";
import { BookList } from "../data/BookList";
import { booksQuery } from "./__generated__/booksQuery.graphql";

export const BookListPage: React.FC = () => {
    const queryRef = useLazyLoadQuery<booksQuery>(graphql`
        query booksQuery($count: Int!, $cursor: String) {
            ...BookListFragment
        }
    `, { count: 8 });
    const [, navigate] = useLocation();

    return (
        <div>
            <button onClick={() => navigate("books/new")}>new</button>
            <BookList queryRef={queryRef} />
        </div>
    );
};
