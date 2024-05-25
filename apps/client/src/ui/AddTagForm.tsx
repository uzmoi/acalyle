import { style } from "@acalyle/css";
import { Form, TextInput, vars } from "@acalyle/ui";
import { useCallback, useRef, useState } from "react";
import type { ID } from "~/__generated__/graphql";
import { addMemoTags } from "~/note/store/note";
import { TagComplementList } from "./TagComplementList";

export const AddTagForm: React.FC<{
    bookHandle: string;
    memoId: ID;
    onCompleted?: () => void;
}> = ({ bookHandle, memoId, onCompleted }) => {
    const [tagString, setTagString] = useState("");
    const [caretIndex, setCaretIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const complementTagRef = useRef<string>();

    const onComplement = useCallback((tag: string) => {
        setTagString(tag);
        setSelectedIndex(0);
    }, []);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            switch (e.key) {
                case "Tab": {
                    e.preventDefault();
                    if (complementTagRef.current) {
                        onComplement(complementTagRef.current);
                    }
                    break;
                }
                case "ArrowUp": {
                    e.preventDefault();
                    setSelectedIndex(index => index - 1);
                    break;
                }
                case "ArrowDown": {
                    e.preventDefault();
                    setSelectedIndex(index => index + 1);
                    break;
                }
            }
        },
        [onComplement],
    );

    const onValueChang = useCallback((value: string) => {
        setTagString(value);
        setSelectedIndex(0);
    }, []);

    const onSelect = useCallback(
        (e: React.SyntheticEvent<HTMLInputElement>) => {
            const el = e.currentTarget;
            setCaretIndex(
                (el.selectionDirection === "backward" ?
                    el.selectionStart
                :   el.selectionEnd) ?? 0,
            );
            setSelectedIndex(0);
        },
        [],
    );

    const onSubmit = useCallback(() => {
        void addMemoTags(memoId, [tagString]).then(onCompleted);
    }, [memoId, onCompleted, tagString]);

    return (
        <Form
            onSubmit={onSubmit}
            className={style({ minWidth: "8em", maxWidth: "32em" })}
        >
            <TextInput
                value={tagString}
                onKeyDown={onKeyDown}
                onValueChange={onValueChang}
                onSelect={onSelect}
                className={style({
                    fontFamily: vars.font.mono,
                    minWidth: "100%",
                })}
            />
            <TagComplementList
                ref={complementTagRef}
                bookHandle={bookHandle}
                input={tagString.slice(0, caretIndex)}
                selectedIndex={selectedIndex}
                onComplement={onComplement}
            />
        </Form>
    );
};
