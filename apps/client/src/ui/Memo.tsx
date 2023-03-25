import { Button } from "@acalyle/ui";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import { memoStore } from "~/store/memo";
import { AddTagButton } from "~/ui/AddTagButton";
import { MemoContentsEditor } from "~/ui/MemoContentsEditor";
import { TagList } from "./TagList";

export const Memo: React.FC<{
    bookId: string;
    memoId: string;
}> = ({ bookId, memoId }) => {
    const memo = useStore(memoStore(memoId));

    const [isInEdit, setIsInEdit] = useState(false);

    if (memo == null) {
        return null;
    }

    return (
        <article>
            <header>
                <TagList tags={memo.tags} />
                <AddTagButton bookId={bookId} memoId={memoId} />
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
