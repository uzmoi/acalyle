import { useState } from "react";
import { graphql, useMutation } from "react-relay";
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

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        commitNewBook({
            variables: { title },
            onCompleted({ createBook }) {
                // TODO: ページ遷移
                createBook.id;
            },
        });
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Create a new book</h1>
            <div>
                <label htmlFor="book_title">Book title</label>
                <input
                    id="book_title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    readOnly={isInFlight}
                />
            </div>
            <button disabled={isInFlight}>create book</button>
        </form>
    );
};
