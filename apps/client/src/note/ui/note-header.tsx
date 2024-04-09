import { style } from "@macaron-css/core";
import { useMemo } from "react";
import { BiClipboard, BiTransfer, BiTrash } from "react-icons/bi";
import type { ID } from "~/__generated__/graphql";
import type { BookRef } from "~/book/store";
import { removeNote, transferNote } from "~/note/store/note";
import { AddTagButton } from "~/ui/AddTagButton";
import { TimeStamp } from "~/ui/TimeStamp";
import { confirm, selectBook } from "~/ui/modal";
import { TagList } from "~/ui/tag/TagList";
import { useNote } from "./hook";
import { type MenuAction, NoteMenu } from "./note-menu";

const noteActions = (noteId: ID): readonly MenuAction[] => [
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
        onClick: async () => {
            const bookId = await selectBook();
            if (bookId != null) {
                void transferNote(noteId, bookId);
            }
        },
    },
    {
        icon: <BiTrash />,
        text: "Delete memo",
        type: "danger",
        onClick: async () => {
            const ok = await confirm("Delete memo");
            if (ok) {
                void removeNote(noteId);
            }
        },
    },
];

export const NoteHeader: React.FC<{
    bookRef: BookRef;
    noteId: ID;
}> = ({ bookRef, noteId }) => {
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
                <AddTagButton bookHandle={bookRef} memoId={noteId} />
            </div>
        </header>
    );
};
