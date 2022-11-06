import { graphql, useLazyLoadQuery } from "react-relay";
import { Book } from "~/widgets/book/Book";
import { bookQuery } from "./__generated__/bookQuery.graphql";

export const BookPage: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    // prettier-ignore
    const { book } = useLazyLoadQuery<bookQuery>(graphql`
        query bookQuery($id: ID!, $count: Int = 100, $cursor: String) {
            book(id: $id) {
                title
                createdAt
                ...BookMemosFragment
            }
        }
    `, { id: bookId });

    if (book == null) {
        return <div>book not found (id: {bookId})</div>;
    }

    return <Book id={bookId} book={book} />;
};
