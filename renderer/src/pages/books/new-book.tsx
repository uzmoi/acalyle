import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { BookTitle } from "~/features/book-form/book-title";
import { Button } from "~/shared/control";
import { useNavigate } from "~/shared/router/react";
import { newBookCreateMutation } from "./__generated__/newBookCreateMutation.graphql";

export const NewBookPage: React.FC = () => {
    const [title, setTitle] = useState("");
    // prettier-ignore
    const [commitNewBook, isInFlight] = useMutation<newBookCreateMutation>(graphql`
        mutation newBookCreateMutation($title: String!) {
            createBook(title: $title) {
                id
            }
        }
    `);

    const navigate = useNavigate();
    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        commitNewBook({
            variables: { title },
            onCompleted({ createBook }) {
                navigate("books/:bookId", { bookId: createBook.id });
            },
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Create a new book</h1>
            <BookTitle
                title={title}
                setTitle={setTitle}
                disabled={isInFlight}
            />
            <Button type="submit" disabled={isInFlight}>
                create book
            </Button>
        </form>
    );
};
