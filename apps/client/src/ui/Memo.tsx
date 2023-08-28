import { AcalyleMemoTag } from "@acalyle/core";
import { Button, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useMemo, useState } from "react";
import { BiClipboard, BiEditAlt, BiTransfer, BiTrash } from "react-icons/bi";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore, removeMemo, transferMemo } from "~/store/memo";
import { AddTagButton } from "~/ui/AddTagButton";
import { MemoContentsEditor } from "~/ui/MemoContentsEditor";
import { MemoInfo } from "~/ui/MemoInfo";
import { MemoMenu, type MenuAction } from "~/ui/MemoMenu";
import { confirm, selectBook } from "~/ui/modal";
import { TagList } from "./TagList";
import { NoteBody } from "./note/NoteBody";
import { NoteOverview } from "./note/NoteOverview";
import { NoteOverviewWarpList } from "./note/NoteOverviewWarpList";

export const Memo: React.FC<{
    bookHandle: string;
    memoId: Scalars["ID"];
}> = ({ bookHandle, memoId }) => {
    const memo = usePromiseLoader(useStore(memoStore(memoId)));

    const [isInEdit, setIsInEdit] = useState(false);

    const actions = useMemo<readonly MenuAction[]>(
        () => [
            {
                icon: <BiClipboard />,
                text: "Copy memo id",
                onClick: () => {
                    void navigator.clipboard.writeText(memoId);
                },
            },
            {
                icon: <BiTransfer />,
                text: "Transfer memo",
                onClick: () => {
                    void selectBook().then(bookId => {
                        if (bookId != null) {
                            void transferMemo(memoId, bookId);
                        }
                    });
                },
            },
            {
                icon: <BiTrash />,
                text: "Delete memo",
                type: "denger",
                onClick: () => {
                    void confirm("Delete memo").then(ok => {
                        if (ok) {
                            void removeMemo(memoId);
                        }
                    });
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
                    <NoteOverview
                        bookId={bookHandle}
                        memoId={relateMemoId as Scalars["ID"]}
                    />
                </div>
            )}
            <header>
                <div
                    className={style({ display: "flex", alignItems: "center" })}
                >
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
            <div
                className={style({
                    marginTop: "1em",
                    position: "relative",
                })}
            >
                <Button
                    variant="unstyled"
                    className={style({
                        position: "absolute",
                        top: 0,
                        right: 0,
                        translate: "50% -50%",
                        padding: "0.25em",
                        lineHeight: 1,
                        borderRadius: "50%",
                        backgroundColor: vars.color.bg.inline,
                        zIndex: vars.zIndex.max,
                        ":disabled": {
                            visibility: "hidden",
                        },
                        transition: "opacity 125ms",
                        opacity: 0,
                        selectors: {
                            ":hover > &, &:hover": {
                                opacity: 1,
                            },
                        },
                    })}
                    onClick={() => {
                        setIsInEdit(true);
                    }}
                    disabled={isInEdit}
                    aria-label="Edit contents"
                >
                    <BiEditAlt className={style({ verticalAlign: "middle" })} />
                </Button>
                {isInEdit ? (
                    <MemoContentsEditor
                        memoId={memoId}
                        defaultContents={memo.contents}
                        onEditEnd={() => {
                            setIsInEdit(false);
                        }}
                    />
                ) : (
                    <NoteBody contents={memo.contents} />
                )}
            </div>
            <NoteOverviewWarpList
                book={bookHandle}
                query={`@relate:${memoId}`}
            />
        </article>
    );
};
