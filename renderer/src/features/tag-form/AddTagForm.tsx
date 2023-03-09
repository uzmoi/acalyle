import { AcalyleMemoTag } from "@acalyle/core";
import { Form, TextInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useRef, useState } from "react";
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
    const [selectedIndex, setSelectedIndex] = useState(0);
    const complementTagRef = useRef<string>();

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            switch (e.key) {
                case "Tab":
                    e.preventDefault();
                    if (complementTagRef.current) {
                        setTagString(complementTagRef.current);
                        setSelectedIndex(0);
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex(index => index - 1);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex(index => index + 1);
                    break;
            }
        },
        [],
    );

    const onValueChang = useCallback((value: string) => {
        setTagString(value);
        setSelectedIndex(0);
    }, []);

    const onSelect = useCallback(
        (e: React.SyntheticEvent<HTMLInputElement>) => {
            const el = e.currentTarget;
            setCaretIndex(
                (el.selectionDirection === "backward"
                    ? el.selectionStart
                    : el.selectionEnd) || 0,
            );
            setSelectedIndex(0);
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
                onKeyDown={onKeyDown}
                onValueChange={onValueChang}
                onSelect={onSelect}
                className={style({ minWidth: "100%" })}
            />
            <TagComplementList
                ref={complementTagRef}
                bookId={bookId}
                input={tagString.slice(0, caretIndex)}
                selectedIndex={selectedIndex}
            />
        </Form>
    );
};
