import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useMemo, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { memoStore } from "~/store/memo";
import { AddTagButton } from "~/ui/AddTagButton";
import { MemoContentsEditor } from "~/ui/MemoContentsEditor";
import { MemoInfo } from "~/ui/MemoInfo";
import { MemoMenu, type MenuAction } from "~/ui/MemoMenu";
import { TagList } from "./TagList";

export const Memo: React.FC<{
    bookId: string;
    memoId: string;
}> = ({ bookId, memoId }) => {
    const memo = useStore(memoStore(memoId));

    const [isInEdit, setIsInEdit] = useState(false);

    const actions = useMemo<readonly MenuAction[]>(
        () => [
            {
                icon: <BiEditAlt />,
                text: "Edit contents",
                onClick: () => {
                    setIsInEdit(true);
                },
            },
        ],
        [],
    );

    if (memo == null) {
        return null;
    }

    return (
        <article>
            <header>
                <TagList tags={memo.tags} />
                <AddTagButton bookId={bookId} memoId={memoId} />
                <div className={style({ display: "flex" })}>
                    <MemoInfo
                        memo={memo}
                        className={style({ flex: "1 0", fontSize: "0.725em" })}
                    />
                    <MemoMenu actions={actions} />
                </div>
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
