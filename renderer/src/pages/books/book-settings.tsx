import { css } from "@linaria/core";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";
import { BookTitleForm } from "~/features/book-form";
import { useNavigate } from "~/shared/router/react";
import { bookSettingsDataQuery } from "./__generated__/bookSettingsDataQuery.graphql";
import { bookSettingsDeleteMutation } from "./__generated__/bookSettingsDeleteMutation.graphql";

export const BookSettingsPage: React.FC<{
    id: string;
}> = ({ id }) => {
    const { book } = useLazyLoadQuery<bookSettingsDataQuery>(graphql`
        query bookSettingsDataQuery($id: ID!) {
            book(id: $id) {
                title
            }
        }
    `, { id });

    const [commitDeleteBook, isInFlight] = useMutation<bookSettingsDeleteMutation>(graphql`
        mutation bookSettingsDeleteMutation($id: ID!) {
            deleteBook(id: $id)
        }
    `);

    const navigate = useNavigate();

    const deleteBook = () => {
        commitDeleteBook({
            variables: { id },
            onCompleted() {
                navigate("books");
            },
        });
    };

    if(book == null) {
        return <div>book not found (id: {id})</div>;
    }

    return (
        <div className={BookSettingsPageStyle}>
            <BookTitleForm id={id} currentTitle={book.title} />
            <button onClick={deleteBook} disabled={isInFlight}>
                delete book
            </button>
        </div>
    );
};

const BookSettingsPageStyle = css`
    /* - */
`;
