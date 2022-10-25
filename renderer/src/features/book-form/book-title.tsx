import { css } from "@linaria/core";
import { useId, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { Button, TextInput } from "~/shared/control";
import { bookTitleMutation } from "./__generated__/bookTitleMutation.graphql";

export const BookTitleForm: React.FC<{
    bookId: string;
    currentTitle: string;
}> = ({ bookId, currentTitle }) => {
    const [title, setTitle] = useState(currentTitle);

    const [commit, isInFlight] = useMutation<bookTitleMutation>(graphql`
        mutation bookTitleMutation($id: ID!, $title: String) {
            updateBookTitle(id: $id, title: $title) {
                id
            }
        }
    `);
    const handleSubmit = () => {
        commit({
            variables: { id: bookId, title },
        });
    };

    return (
        <form onSubmit={handleSubmit} className={BookTitleFormStyle}>
            <BookTitle title={title} setTitle={setTitle} disabled={isInFlight} />
            <Button type="submit">Rename</Button>
        </form>
    );
};

const BookTitleFormStyle = css`
    font-size: 0.9em;
`;

export const BookTitle: React.FC<{
    title: string;
    setTitle: (title: string) => void;
    disabled?: boolean;
}> = ({ title, setTitle, disabled }) => {
    const htmlBookTitleId = useId();

    return (
        <dl className={DlStyle}>
            <dt>
                <label htmlFor={htmlBookTitleId} className={LabelStyle}>
                    Book title
                </label>
            </dt>
            <dd>
                <TextInput
                    id={htmlBookTitleId}
                    className={InputStyle}
                    value={title}
                    onValueChange={setTitle}
                    required
                    maxLength={32}
                    disabled={disabled}
                />
            </dd>
        </dl>
    );
};

const DlStyle = css`
    display: inline-block;
    margin-right: 0.4em;
`;

const LabelStyle = css`
    font-size: 0.9em;
    font-weight: bold;
`;

const InputStyle = css`
    width: 16em;
`;
