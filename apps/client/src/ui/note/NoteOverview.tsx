import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { link } from "~/pages/link";
import { memoStore } from "~/store/memo";
import { Link } from "../Link";
import { TagList } from "../TagList";
import { openNoteInModal } from "../modal";
import { NoteBody } from "./NoteBody";

/** @private */
export const useNoteOverview = (noteId: Scalars["ID"]) => {
    const noteLoader = useStore(memoStore(noteId));
    return usePromiseLoader(noteLoader);
};

export const NoteOverview: React.FC<{
    bookId: Scalars["ID"];
    noteId: Scalars["ID"];
    clickAction?: "open-link" | "open-modal";
}> = ({ bookId, noteId, clickAction = "open-modal" }) => {
    const note = useNoteOverview(noteId);

    if (note == null) return null;

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
                    to={link(":bookId/:memoId", { bookId, memoId: noteId })}
                    onClick={e => {
                        if (clickAction === "open-modal") {
                            // NOTE: noscript環境でなるべく正しく動くようにLinkのままpreventDefaultしている。
                            // これが本当正しいのかはわからない。
                            e.preventDefault();
                            void openNoteInModal(bookId, noteId);
                        }
                    }}
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

const visuallyHidden = style(
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
