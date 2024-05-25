import { style } from "@acalyle/css";
import { vars, visuallyHidden } from "@acalyle/ui";
import { useCallback } from "react";
import type { ID } from "~/__generated__/graphql";
import { bookRefOf } from "~/book/store";
import { useBook } from "~/book/ui/hook";
import { link } from "~/pages/link";
import { Link } from "~/ui/Link";
import { openNoteInModal } from "~/ui/modal";
import { useNote } from "./hook";
import { NoteContents } from "./note-contents";
import { TagList } from "./tag-list";

type ClickAction = "open-link" | "open-modal";

const useNoteOverviewAction = (
    bookId: ID,
    noteId: ID,
    clickAction: ClickAction = "open-modal",
): ((e: React.MouseEvent) => void) => {
    return useCallback(
        (e: React.MouseEvent) => {
            if (clickAction === "open-modal") {
                // NOTE: noscript環境でなるべく正しく動くようにLinkのままpreventDefaultしている。
                // これが本当正しいのかはわからない。
                e.preventDefault();
                void openNoteInModal(bookId, noteId);
            }
        },
        [bookId, noteId, clickAction],
    );
};

export const NoteOverview: React.FC<{
    bookId: ID;
    noteId: ID;
    clickAction?: ClickAction;
}> = ({ bookId, noteId, clickAction }) => {
    const book = useBook(bookId);
    const note = useNote(noteId);
    const handleClick = useNoteOverviewAction(bookId, noteId, clickAction);

    if (book == null || note == null) return null;

    return (
        <article
            data-note-id={noteId}
            className={style({
                minWidth: "24em",
                minHeight: "8em",
                display: "flex",
                flexDirection: "column",
                paddingBlock: "0.25em",
                backgroundColor: vars.color.bg.block,
            })}
        >
            <div
                className={style({
                    flex: "1 1 0",
                    position: "relative",
                    overflow: "hidden",
                })}
            >
                <Link
                    to={link(":bookId/:memoId", {
                        bookId: bookRefOf(book),
                        memoId: noteId,
                    })}
                    onClick={handleClick}
                    className={style({
                        position: "absolute",
                        inset: 0,
                        zIndex: vars.zIndex.modal,
                    })}
                >
                    <span className={visuallyHidden}>Open note.</span>
                </Link>
                <NoteContents contents={note.contents} />
            </div>
            <TagList
                tags={note.tags}
                className={style({ marginInline: "0.5em" })}
            />
        </article>
    );
};
