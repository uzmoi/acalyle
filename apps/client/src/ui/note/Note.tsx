import { AcalyleMemoTag } from "@acalyle/core";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";
import { BiClipboard, BiTransfer, BiTrash } from "react-icons/bi";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore, removeMemo, transferMemo } from "~/store/memo";
import { AddTagButton } from "../AddTagButton";
import { MemoInfo } from "../MemoInfo";
import { MemoMenu, type MenuAction } from "../MemoMenu";
import { confirm, selectBook } from "../modal";
import { TagList } from "../tag/TagList";
import { NoteContents } from "./NoteContents";
import { NoteOverview } from "./NoteOverview";
import { NoteOverviewWarpList } from "./NoteOverviewWarpList";

const useNote = (noteId: Scalars["ID"]) => {
    const noteLoader = useStore(memoStore(noteId));
    return usePromiseLoader(noteLoader);
};

const noteActions = (noteId: Scalars["ID"]): readonly MenuAction[] => [
    {
        icon: <BiClipboard />,
        text: "Copy memo id",
        onClick: () => {
            void navigator.clipboard.writeText(noteId);
        },
    },
    {
        icon: <BiTransfer />,
        text: "Transfer memo",
        onClick: () => {
            void selectBook().then(bookId => {
                if (bookId != null) {
                    void transferMemo(noteId, bookId);
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
                    void removeMemo(noteId);
                }
            });
        },
    },
];

export const Note: React.FC<{
    book: string;
    noteId: Scalars["ID"];
}> = ({ book: bookHandle, noteId }) => {
    const note = useNote(noteId);

    const actions = useMemo(() => noteActions(noteId), [noteId]);

    if (note == null) return null;

    const relateMemoId = note.tags
        .map(AcalyleMemoTag.fromString)
        .find(tag => tag?.symbol === "@relate")?.prop;

    return (
        <article data-note-id={noteId}>
            {relateMemoId && (
                <div className={style({ marginBottom: "0.5em" })}>
                    <NoteOverview
                        bookId={bookHandle as Scalars["ID"]}
                        noteId={relateMemoId as Scalars["ID"]}
                    />
                </div>
            )}
            <header>
                <div
                    className={style({ display: "flex", alignItems: "center" })}
                >
                    <MemoInfo
                        memo={note}
                        className={style({ flex: "1 0", fontSize: "0.725em" })}
                    />
                    <MemoMenu actions={actions} />
                </div>
                <div className={style({ marginTop: "0.5em" })}>
                    <TagList
                        tags={note.tags}
                        className={style({ display: "inline-block" })}
                    />
                    <AddTagButton bookHandle={bookHandle} memoId={noteId} />
                </div>
            </header>
            <NoteContents noteId={noteId} />
            <NoteOverviewWarpList
                book={bookHandle}
                query={`@relate:${noteId}`}
            />
        </article>
    );
};
