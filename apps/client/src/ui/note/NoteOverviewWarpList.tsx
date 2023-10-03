import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import type { Scalars } from "~/__generated__/graphql";
import { useBookId } from "~/store/hook";
import { memoConnection } from "~/store/memo-connection";
import { NoteOverview } from "./NoteOverview";

const useNoteOverviewWarpList = (
    bookId: Scalars["ID"],
    query = "",
): readonly Scalars["ID"][] => {
    const { nodeIds } = useStore(memoConnection(bookId, query));
    return nodeIds;
};

export const NoteOverviewWarpList: React.FC<{
    book: string;
    query?: string;
}> = ({ book, query }) => {
    const bookId = useBookId(book);
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
