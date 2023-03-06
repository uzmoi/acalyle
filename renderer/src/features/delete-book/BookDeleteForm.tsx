import { Button, ControlGroup, Form, TextInput, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { BookDeleteFormMutation } from "./__generated__/BookDeleteFormMutation.graphql";

export const BookDeleteForm: React.FC<{
    bookId: string;
    confirmText: string;
    onDeleted?: () => void;
}> = ({ bookId, confirmText, onDeleted }) => {
    const [commit, isInFlight] = useMutation<BookDeleteFormMutation>(graphql`
        mutation BookDeleteFormMutation($id: ID!) {
            deleteBook(id: $id) @deleteRecord
        }
    `);

    const deleteBook = useCallback(() => {
        commit({
            variables: { id: bookId },
            onCompleted() {
                onDeleted?.();
            },
        });
    }, [bookId, commit, onDeleted]);

    const [pass, setPass] = useState("");

    return (
        <Form onSubmit={deleteBook}>
            <p>
                Please type &quot;
                <code
                    className={style({
                        paddingInline: "0.25em",
                        fontFamily: vars.font.mono,
                        backgroundColor: vars.color.bg4,
                    })}
                >
                    {confirmText}
                </code>
                &quot; to confirm.
            </p>
            <ControlGroup className={style({ marginTop: "0.5em" })}>
                <TextInput onValueChange={setPass} />
                <Button
                    type="submit"
                    disabled={pass !== confirmText || isInFlight}
                    className={style({ marginLeft: "1em" })}
                >
                    Delete this book
                </Button>
            </ControlGroup>
        </Form>
    );
};
