import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import type { ID } from "~/__generated__/graphql";
import type { BookRef } from "~/book/store";
import { useBookId } from "~/book/ui/hook";
import { noteConnection } from "~/note/store";
import { NoteOverview } from "./note-overview";

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
                gridTemplateColumns: "repeat(auto-fill, minmax(16em, 1fr))",
            })}
        >
            {notes.map(id => (
                <NoteOverview key={id} bookId={bookId} noteId={id} />
            ))}
        </div>
    );
};
