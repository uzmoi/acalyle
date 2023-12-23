import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback } from "react";
import type { ID } from "~/__generated__/graphql";
import { link } from "~/pages/link";
import { Link } from "../Link";
import { useBook } from "../book/use-book";
import { openNoteInModal } from "../modal";
import { TagList } from "../tag/TagList";
import { NoteBody } from "./NoteBody";
import { useNote } from "./use-note";

export const NoteOverview: React.FC<{
    bookId: ID;
    noteId: ID;
    clickAction?: "open-link" | "open-modal";
}> = ({ bookId, noteId, clickAction = "open-modal" }) => {
    const book = useBook(bookId);
    const note = useNote(noteId);

    const handleClick = useCallback(
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

    if (book == null || note == null) return null;

    const memoLink = link(":bookId/:memoId", {
        bookId: book.handle ? `@${book.handle}` : book.id,
        memoId: noteId,
    });

    return (
        <article
            data-note-id={noteId}
            className={style({
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
                    to={memoLink}
                    onClick={handleClick}
                    className={style({
                        position: "absolute",
                        inset: 0,
                        zIndex: vars.zIndex.modal,
                    })}
                >
                    <span className={visuallyHidden}>Open note.</span>
                </Link>
                <NoteBody contents={note.contents} />
            </div>
            <TagList tags={note.tags} />
        </article>
    );
};

const visuallyHidden = /* #__PURE__ */ style(
    {
        position: "fixed",
        padding: 0,
        margin: "-1px",
        width: "1px",
        height: "1px",
        opacity: "0",
        overflow: "hidden",
        border: "none",
        clip: "rect(0 0 0 0)",
    },
    "visually-hidden",
);
