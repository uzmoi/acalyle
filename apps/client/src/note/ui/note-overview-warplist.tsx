import { style } from "@acalyle/css";
import { useStore } from "@nanostores/react";
import type { BookRef } from "~/book/store";
import { useBookId } from "~/book/ui/hook";
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
    const bookId = useBookId(bookRef);
    const notes = useNoteOverviewWarpList(bookId, query);

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
