import { style } from "@acalyle/css";
import { Alert, vars } from "@acalyle/ui";
import { BiError } from "react-icons/bi";
import type { BookRef } from "~/book/store";
import { type NoteId, useNote } from "~/entities/note";
import type { ID } from "~/lib/graphql";
import type { Note as NoteType } from "../store";
import { MIN_NOTE_WIDTH } from "./constants";
import { NoteBody } from "./note-body";
import { NoteHeader } from "./note-header";

export const Note: React.FC<{
    bookRef: BookRef;
    noteId: ID;
}> = ({ bookRef, noteId }) => {
    const note = useNote(noteId as string as NoteId);

    if (note == null) {
        return (
            // REVIEW: role="alert"ってこういう所で使っていいものなのか
            <Alert type="error">
                <BiError
                    className={style({
                        color: vars.color.danger,
                        fontSize: "1.75em",
                        marginRight: "0.25em",
                    })}
                />
                <span className={style({ verticalAlign: "middle" })}>
                    Note not found!
                </span>
                <p>
                    note id:{" "}
                    <span className={style({ userSelect: "all" })}>
                        {noteId}
                    </span>
                </p>
            </Alert>
        );
    }

    return (
        <article
            data-note-id={noteId}
            className={style({ minWidth: MIN_NOTE_WIDTH, minHeight: "8em" })}
        >
            <NoteHeader bookRef={bookRef} note={note as unknown as NoteType} />
            <NoteBody noteId={noteId} contents={note.contents} />
        </article>
    );
};
