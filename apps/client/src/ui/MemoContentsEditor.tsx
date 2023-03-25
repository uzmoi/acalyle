import { Button, ControlGroup, Form, TextArea } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useState } from "react";
import { updateMemoContents } from "~/store/memo";

export const MemoContentsEditor: React.FC<{
    memoId: string;
    defaultContents: string;
    onEditEnd?: () => void;
}> = ({ memoId, defaultContents, onEditEnd }) => {
    const [contents, setContents] = useState(defaultContents);

    const onSubmit = useCallback(() => {
        void updateMemoContents(memoId, contents).then(onEditEnd);
    }, [memoId, contents, onEditEnd]);

    return (
        <Form onSubmit={onSubmit}>
            <TextArea value={contents} onValueChange={setContents} />
            <ControlGroup
                className={style({
                    display: "flex",
                    justifyContent: "right",
                    marginTop: "0.5em",
                })}
            >
                <Button onClick={onEditEnd}>Cancel</Button>
                <Button type="submit">Save</Button>
            </ControlGroup>
        </Form>
    );
};
