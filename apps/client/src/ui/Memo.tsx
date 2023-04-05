import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useMemo, useState } from "react";
import { BiClipboard, BiEditAlt, BiTrash } from "react-icons/bi";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore, removeMemo } from "~/store/memo";
import { AddTagButton } from "~/ui/AddTagButton";
import { MemoContentsEditor } from "~/ui/MemoContentsEditor";
import { MemoInfo } from "~/ui/MemoInfo";
import { MemoMenu, type MenuAction } from "~/ui/MemoMenu";
import { TagList } from "./TagList";

export const Memo: React.FC<{
    bookId: string;
    memoId: string;
}> = ({ bookId, memoId }) => {
    const memo = usePromiseLoader(useStore(memoStore(memoId)));

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
            {
                icon: <BiClipboard />,
                text: "Copy memo id",
                onClick: () => {
                    void navigator.clipboard.writeText(memoId);
                },
            },
            {
                icon: <BiTrash />,
                text: "Delete memo",
                color: "#e44",
                onClick: () => {
                    void removeMemo(memoId);
                },
            },
        ],
        [memoId],
    );

    if (memo == null) {
        return null;
    }

    return (
        <article>
            <header>
                <div className={style({ display: "flex" })}>
                    <MemoInfo
                        memo={memo}
                        className={style({ flex: "1 0", fontSize: "0.725em" })}
                    />
                    <MemoMenu actions={actions} />
                </div>
                <div className={style({ marginTop: "0.5em" })}>
                    <TagList
                        tags={memo.tags}
                        className={style({ display: "inline-block" })}
                    />
                    <AddTagButton bookId={bookId} memoId={memoId} />
                </div>
            </header>
            <div className={style({ marginTop: "1em" })}>
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
            </div>
        </article>
    );
};
