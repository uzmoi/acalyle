import { useCallback } from "react";
import { graphql, useMutation } from "react-relay";
import { useNavigate } from "~/features/location";
import { link } from "~/pages/link";
import { Button, Form } from "~/shared/control";
import { BookDeleteFormMutation } from "./__generated__/BookDeleteFormMutation.graphql";

export const BookDeleteForm: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const [commit, isInFlight] = useMutation<BookDeleteFormMutation>(graphql`
        mutation BookDeleteFormMutation($id: ID!) {
            deleteBook(id: $id) @deleteRecord
        }
    `);

    const navigate = useNavigate();

    const deleteBook = useCallback(() => {
        commit({
            variables: { id: bookId },
            onCompleted() {
                navigate(link("books"));
            },
        });
    }, [bookId, commit, navigate]);

    return (
        <Form>
            <Button type="submit" onClick={deleteBook} disabled={isInFlight}>
                Delete this book
            </Button>
        </Form>
    );
};
