import { css } from "@linaria/core";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { vars } from "~/entities/theme";
import { useNavigate } from "~/features/location";
import { link } from "~/pages/link";
import { Button, ControlGroup, Form, TextInput } from "~/shared/control";
import { BookDeleteFormMutation } from "./__generated__/BookDeleteFormMutation.graphql";

export const BookDeleteForm: React.FC<{
    bookId: string;
    confirmText: string;
}> = ({ bookId, confirmText }) => {
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

    const [pass, setPass] = useState("");

    return (
        <Form onSubmit={deleteBook}>
            <p>
                Please type &quot;
                <code
                    className={css`
                        padding-inline: 0.25em;
                        font-family: ${vars.font.mono};
                        background-color: ${vars.color.bg4};
                    `}
                >
                    {confirmText}
                </code>
                &quot; to confirm.
            </p>
            <ControlGroup
                className={css`
                    margin-top: 0.5em;
                `}
            >
                <TextInput onValueChange={setPass} />
                <Button
                    type="submit"
                    disabled={pass !== confirmText || isInFlight}
                    className={css`
                        margin-left: 1em;
                    `}
                >
                    Delete this book
                </Button>
            </ControlGroup>
        </Form>
    );
};
