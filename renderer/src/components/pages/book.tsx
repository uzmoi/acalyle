import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { Link, hashNavigate } from "../../router-react";
import { Book } from "../data/Book";
import { bookDeleteMutation } from "./__generated__/bookDeleteMutation.graphql";
import { bookQuery } from "./__generated__/bookQuery.graphql";

export const BookPage: React.FC<{ id: string }> = ({ id }) => {
    const { book } = useLazyLoadQuery<bookQuery>(graphql`
        query bookQuery($id: ID!, $count: Int = 100, $cursor: String) {
            book(id: $id) {
                title
                createdAt
                ...BookMemosFragment
            }
        }
    `, { id });

    const [commitDeleteBook, isInFlight] = useMutation<bookDeleteMutation>(graphql`
        mutation bookDeleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    if(book == null) {
        return <div>book not found (id: {id})</div>;
    }

    const deleteBook = () => {
        commitDeleteBook({
            variables: { id },
            onCompleted() {
                hashNavigate("books");
            },
        });
    };

    return (
        <div>
            <Link pattern="books">return to book list</Link>
            <Book id={id} book={book} />
            <button onClick={deleteBook} disabled={isInFlight}>delete book</button>
        </div>
    );
};
