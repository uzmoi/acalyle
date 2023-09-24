import { useStore } from "@nanostores/react";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore } from "~/store/memo";
import { NoteContents } from "./NoteContents";
import { NoteHeader } from "./NoteHeader";

const useNote = (noteId: Scalars["ID"]) => {
    const noteLoader = useStore(memoStore(noteId));
    return usePromiseLoader(noteLoader);
};

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
