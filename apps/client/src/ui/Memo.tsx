import { Button } from "@acalyle/ui";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { memoStore } from "~/store/memo";
import { MemoContentsEditor } from "~/ui/MemoContentsEditor";
import { TagList } from "./TagList";

export const Memo: React.FC<{
    memoId: string;
}> = ({ memoId }) => {
    const memo = useStore(memoStore(memoId));

    const [isInEdit, setIsInEdit] = useState(false);

    if (memo == null) {
        return null;
    }

    return (
        <article>
            <header>
                <TagList tags={memo.tags} />
                <Button
                    disabled={isInEdit}
                    onClick={() => {
                        setIsInEdit(true);
                    }}
                >
                    Edit
                </Button>
            </header>
            {isInEdit ? (
                <MemoContentsEditor
                    memoId={memoId}
                    defaultContents={memo.contents}
                    onEditEnd={() => {
                        setIsInEdit(false);
                    }}
                />
            ) : (
                <div>{memo.contents}</div>
            )}
        </article>
    );
};
