import { AcalyleMemoTag } from "@acalyle/core";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useMemo, useState } from "react";
import { BiClipboard, BiEditAlt, BiTrash } from "react-icons/bi";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore, removeMemo } from "~/store/memo";
import { AddTagButton } from "~/ui/AddTagButton";
import { MemoContentsEditor } from "~/ui/MemoContentsEditor";
import { MemoInfo } from "~/ui/MemoInfo";
import { MemoList } from "~/ui/MemoList";
import { MemoMenu, type MenuAction } from "~/ui/MemoMenu";
import { MemoOverview } from "~/ui/MemoOverview";
import { TagList } from "./TagList";

export const Memo: React.FC<{
    bookHandle: string;
    memoId: string;
}> = ({ bookHandle, memoId }) => {
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
                type: "denger",
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

    const relateMemoId = memo.tags
        .map(AcalyleMemoTag.fromString)
        .find(tag => tag?.symbol === "@relate")?.prop;

    return (
        <article>
            {relateMemoId && (
                <div className={style({ marginBottom: "0.5em" })}>
                    <MemoOverview bookId={bookHandle} memoId={relateMemoId} />
                </div>
            )}
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
                    <AddTagButton bookHandle={bookHandle} memoId={memoId} />
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
                    <div
                        className={style({
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                        })}
                    >
                        {memo.contents}
                    </div>
                )}
            </div>
            <MemoList bookHandle={bookHandle} query={`@relate:${memoId}`} />
        </article>
    );
};
