import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { Book } from "../data/Book";
import { bookDeleteMutation } from "./__generated__/bookDeleteMutation.graphql";
import { bookQuery } from "./__generated__/bookQuery.graphql";

export const BookPage: React.VFC<{ id: string }> = ({ id }) => {
    const { book } = useLazyLoadQuery<bookQuery>(graphql`
        query bookQuery($id: ID!) {
            book(id: $id) {
                title
                createdAt
            }
        }
    `, { id });

    const [commitDeleteBook, isInFlight] = useMutation<bookDeleteMutation>(graphql`
        mutation bookDeleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    if(book == null) {
        return <div>book not found</div>;
    }

    const deleteBook = () => {
        commitDeleteBook({
            variables: { id },
            onCompleted() {
                // TODO: ページ遷移(to books)
            },
        });
    };

    return (
        <div>
            <Book book={book} />
            <button onClick={deleteBook} disabled={isInFlight}>delete book</button>
        </div>
    );
};
