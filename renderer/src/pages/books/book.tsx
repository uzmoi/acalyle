import { style } from "@macaron-css/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import { Book } from "~/widgets/book/Book";
import type { bookQuery } from "./__generated__/bookQuery.graphql";

export const BookPage: React.FC<{
    bookId: string;
    tab?: number;
}> = ({ bookId, tab }) => {
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

    return (
        <main className={style({ padding: "2em" })}>
            <h2 className={style({ paddingBottom: "1em" })}>{book.title}</h2>
            <Book id={bookId} book={book} tab={tab} />
        </main>
    );
};
