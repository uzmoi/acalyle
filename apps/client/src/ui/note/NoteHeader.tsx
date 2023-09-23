import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useMemo } from "react";
import { BiClipboard, BiTransfer, BiTrash } from "react-icons/bi";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore, removeMemo, transferMemo } from "~/store/memo";
import { AddTagButton } from "../AddTagButton";
import { TimeStamp } from "../TimeStamp";
import { confirm, selectBook } from "../modal";
import { TagList } from "../tag/TagList";
import { type MenuAction, NoteMenu } from "./NoteMenu";

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

export const NoteHeader: React.FC<{
    bookHandle: string;
    noteId: Scalars["ID"];
}> = ({ bookHandle, noteId }) => {
    const note = useNote(noteId);

    const actions = useMemo(() => noteActions(noteId), [noteId]);

    if (note == null) return null;

    return (
        <header>
            <div className={style({ display: "flex", alignItems: "center" })}>
                <div className={style({ flex: "1 0", fontSize: "0.725em" })}>
                    <p>
                        updated <TimeStamp dt={note.updatedAt} />
                    </p>
                    <p>
                        created <TimeStamp dt={note.createdAt} />
                    </p>
                </div>
                <NoteMenu actions={actions} />
            </div>
            <div className={style({ marginTop: "0.5em" })}>
                <TagList
                    tags={note.tags}
                    className={style({ display: "inline-block" })}
                />
                <AddTagButton bookHandle={bookHandle} memoId={noteId} />
            </div>
        </header>
    );
};
