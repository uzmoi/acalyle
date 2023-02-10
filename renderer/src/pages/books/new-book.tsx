import { css } from "@linaria/core";
import { useId, useState } from "react";
import { graphql, useMutation } from "react-relay";
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

    const htmlId = useId();
    const titleId = `${htmlId}-title`;
    const descriptionId = `${htmlId}-description`;

    return (
        <main
            className={css`
                padding: 2em;
            `}
        >
            <Form onSubmit={onSubmit}>
                <h1>Create a new book</h1>
                <dl>
                    <dt className={DTStyle}>
                        <label htmlFor={titleId} className={LabelStyle}>
                            Book title (required)
                        </label>
                    </dt>
                    <dd>
                        <TextInput
                            id={titleId}
                            className={css`
                                width: 100%;
                                min-width: 16em;
                                max-width: 32em;
                            `}
                            value={title}
                            onValueChange={setTitle}
                            required
                            maxLength={32}
                            disabled={isInFlight}
                        />
                    </dd>
                    <dt className={DTStyle}>
                        <label htmlFor={descriptionId} className={LabelStyle}>
                            Description
                        </label>
                    </dt>
                    <dd>
                        <TextInput
                            id={descriptionId}
                            className={css`
                                width: 100%;
                                min-width: 16em;
                            `}
                            value={description}
                            onValueChange={setDescription}
                            maxLength={500}
                            disabled={isInFlight}
                        />
                    </dd>
                </dl>
                <Button
                    type="submit"
                    disabled={isInFlight}
                    className={css`
                        margin-top: 1em;
                    `}
                >
                    Create book
                </Button>
            </Form>
        </main>
    );
};

const DTStyle = css`
    margin-top: 1em;
    margin-bottom: 0.25em;
`;

const LabelStyle = css`
    font-size: 0.9em;
    font-weight: bold;
`;
