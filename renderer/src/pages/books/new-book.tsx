import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, TextInput } from "~/shared/control";
import { useNavigate } from "~/shared/router/react";
import { newBookCreateMutation } from "./__generated__/newBookCreateMutation.graphql";

export const NewBookPage: React.FC = () => {
    const [title, setTitle] = useState("");
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
            <div>
                <label htmlFor="book_title">Book title</label>
                <TextInput
                    id="book_title"
                    value={title}
                    onValueChange={setTitle}
                    readOnly={isInFlight}
                />
            </div>
            <Button disabled={isInFlight}>create book</Button>
        </form>
    );
};
