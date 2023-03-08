import { AcalyleMemoTag } from "@acalyle/core";
import { Form, TextInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { TagComplementList } from "./TagComplementList";
import type { AddTagFormMutation } from "./__generated__/AddTagFormMutation.graphql";

export const AddTagForm: React.FC<{
    bookId: string;
    memoId: string;
    onCompleted?: () => void;
}> = ({ bookId, memoId, onCompleted }) => {
    const [commit, isInFlight] = useMutation<AddTagFormMutation>(graphql`
        mutation AddTagFormMutation($memoId: ID!, $tag: String!) {
            upsertMemoTags(memoIds: [$memoId], tags: [$tag]) {
                id
                tags
            }
        }
    `);

    const [tagString, setTagString] = useState("");
    const [caretIndex, setCaretIndex] = useState(0);

    const onSelect = useCallback(
        (e: React.SyntheticEvent<HTMLInputElement>) => {
            const el = e.currentTarget;
            setCaretIndex(
                (el.selectionDirection === "backward"
                    ? el.selectionStart
                    : el.selectionEnd) || 0,
            );
        },
        [],
    );

    const onSubmit = useCallback(() => {
        commit({
            variables: { memoId, tag: tagString },
            onCompleted() {
                onCompleted?.();
            },
        });
    }, [commit, memoId, onCompleted, tagString]);

    return (
        <Form
            onSubmit={onSubmit}
            className={style({ minWidth: "8em", maxWidth: "32em" })}
        >
            <TextInput
                disabled={isInFlight}
                value={tagString}
                onValueChange={setTagString}
                onSelect={onSelect}
                className={style({ minWidth: "100%" })}
            />
            <TagComplementList
                bookId={bookId}
                input={tagString.slice(0, caretIndex)}
            />
        </Form>
    );
};
