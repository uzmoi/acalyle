import { AcalyleMemoTag } from "@acalyle/core";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { memoStore } from "~/store/memo";
import { NoteContents } from "./NoteContents";
import { NoteHeader } from "./NoteHeader";
import { NoteOverview } from "./NoteOverview";
import { NoteOverviewWarpList } from "./NoteOverviewWarpList";

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
            <NoteHeader noteId={noteId} bookHandle={bookHandle} />
            <NoteContents noteId={noteId} />
            <NoteOverviewWarpList
                book={bookHandle}
                query={`@relate:${noteId}`}
            />
        </article>
    );
};
