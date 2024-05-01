import { style } from "@macaron-css/core";
import type { ID } from "~/__generated__/graphql";
import type { BookRef } from "~/book/store";
import { AddTagButton } from "~/ui/AddTagButton";
import { TimeStamp } from "~/ui/TimeStamp";
import { TagList } from "~/ui/tag/TagList";
import { useNote } from "./hook";
import { NoteMenuButton } from "./note-menu";

/** @package */
export const NoteHeader: React.FC<{
    bookRef: BookRef;
    noteId: ID;
}> = ({ bookRef, noteId }) => {
    const note = useNote(noteId);

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
                <NoteMenuButton noteId={noteId} />
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
