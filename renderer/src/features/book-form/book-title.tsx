import { useState } from "react";
import { graphql, useMutation } from "react-relay";
import { bookTitleMutation } from "./__generated__/bookTitleMutation.graphql";

export const BookTitle: React.FC<{
    id: string;
    currentTitle: string;
}> = ({ id, currentTitle }) => {
    const [title, setTitle] = useState(currentTitle);
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        setTitle(e.target.value);
    };

    const [commit, isInFlight] = useMutation<bookTitleMutation>(graphql`
        mutation bookTitleMutation($id: ID!, $title: String) {
            editBook(id: $id, title: $title) {
                id
            }
        }
    `);
    const handleSubmit = () => {
        commit({
            variables: { id, title },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Book title</label>
            <input value={title} onChange={handleChange} disabled={isInFlight} />
            <button>Rename</button>
        </form>
    );
};
