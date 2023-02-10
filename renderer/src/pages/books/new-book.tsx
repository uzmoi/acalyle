import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { BookTitleFormBlock } from "~/features/book-form";
import { useNavigate } from "~/features/location";
import { Button, Form, TextInput } from "~/shared/control";
import { link } from "../link";
import { newBookMutation } from "./__generated__/newBookMutation.graphql";

export const NewBookPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [commit, isInFlight] = useMutation<newBookMutation>(graphql`
        mutation newBookMutation($title: String!, $description: String!) {
            createBook(title: $title, description: $description) {
                id
            }
        }
    `);

    const navigate = useNavigate();
    const onSubmit = () => {
        commit({
            variables: { title, description },
            onCompleted({ createBook }) {
                navigate(link("books/:bookId", { bookId: createBook.id }));
            },
        });
    };

    return (
        <Form onSubmit={onSubmit}>
            <h1>Create a new book</h1>
            <BookTitleFormBlock
                title={title}
                setTitle={setTitle}
                disabled={isInFlight}
            />
            <TextInput value={description} onValueChange={setDescription} />
            <Button type="submit" disabled={isInFlight}>
                create book
            </Button>
        </Form>
    );
};
