import { style } from "@acalyle/css";
import { useStore } from "@nanostores/react";
import { type BookRef, useBookByRef } from "~/entities/book";
import { NoteOverview } from "~/entities/note";
import type { ID } from "~/lib/graphql";
import { noteConnection } from "~/note/store";
import { MIN_NOTE_WIDTH } from "./constants";

const useNoteOverviewWarpList = (bookId: ID, query = ""): readonly ID[] => {
    const { nodeIds } = useStore(noteConnection(bookId, query));
    return nodeIds;
};

export const NoteOverviewWarpList: React.FC<{
    bookRef: BookRef;
    query?: string;
}> = ({ bookRef, query }) => {
    const bookId = useBookByRef(bookRef)!.id;
    const notes = useNoteOverviewWarpList(bookId as string as ID, query);

    return (
        <div
            className={style({
                display: "grid",
                gap: "1em 1.25em",
                gridAutoRows: "12em",
                gridTemplateColumns: `repeat(auto-fill, minmax(${MIN_NOTE_WIDTH}, 1fr))`,
            })}
        >
            {notes.map(id => (
                <NoteOverview key={id} bookId={bookId} noteId={id} />
            ))}
        </div>
    );
};
