import type { Scalars } from "~/__generated__/graphql";
import { NoteContents } from "./NoteContents";
import { NoteHeader } from "./NoteHeader";
import { useNote } from "./use-note";

export const Note: React.FC<{
    book: string;
    noteId: Scalars["ID"];
}> = ({ book: bookHandle, noteId }) => {
    const note = useNote(noteId);

    if (note == null) return null;

    return (
        <article data-note-id={noteId}>
            <NoteHeader noteId={noteId} bookHandle={bookHandle} />
            <NoteContents noteId={noteId} />
        </article>
    );
};
