import { Alert, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { BiError } from "react-icons/bi";
import type { Scalars } from "~/__generated__/graphql";
import { NoteContents } from "./NoteContents";
import { NoteHeader } from "./NoteHeader";
import { useNote } from "./use-note";

export const Note: React.FC<{
    book: string;
    noteId: Scalars["ID"];
}> = ({ book, noteId }) => {
    const note = useNote(noteId);

    if (note == null) {
        return (
            // REVIEW: role="alert"ってこういう所で使っていいものなのか
            <Alert type="error">
                <BiError
                    className={style({
                        color: vars.color.denger,
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
        <article data-note-id={noteId}>
            <NoteHeader noteId={noteId} bookHandle={book} />
            <NoteContents noteId={noteId} />
        </article>
    );
};
