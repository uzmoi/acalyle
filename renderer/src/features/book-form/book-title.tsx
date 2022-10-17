import { useId, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, TextInput } from "~/shared/control";
import { bookTitleMutation } from "./__generated__/bookTitleMutation.graphql";

export const BookTitle: React.FC<{
    bookId: string;
    currentTitle: string;
}> = ({ bookId, currentTitle }) => {
    const [title, setTitle] = useState(currentTitle);

    const [commit, isInFlight] = useMutation<bookTitleMutation>(graphql`
        mutation bookTitleMutation($id: ID!, $title: String) {
            editBook(id: $id, title: $title) {
                id
            }
        }
    `);
    const handleSubmit = () => {
        commit({
            variables: { id: bookId, title },
        });
    };

    const htmlBookTitleId = useId();

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor={htmlBookTitleId}>Book title</label>
            <TextInput
                id={htmlBookTitleId}
                value={title}
                onValueChange={setTitle}
                disabled={isInFlight}
            />
            <Button>Rename</Button>
        </form>
    );
};
