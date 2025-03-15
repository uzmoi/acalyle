import { style } from "@acalyle/css";
import { vars, visuallyHidden } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { type BookId, type BookRef, bookRefOf, useBook } from "~/entities/book";
import { openNoteInModal } from "~/features/note-modal";
import { MIN_NOTE_WIDTH } from "~/note/ui/constants";
import { theme } from "~/theme";
import { type NoteId, useNote } from "../model";
import { NoteContents } from "./contents";
import { TagList } from "./tag-list";

type ClickAction = "open-link" | "open-modal";

// TODO: featureに依存してしまっているので、コンポーネントのpropsからハンドラをもらうようにする。
const useNoteOverviewAction = (
  bookRef: BookRef,
  noteId: NoteId,
  clickAction: ClickAction = "open-modal",
): ((e: React.MouseEvent) => void) => {
  return useCallback(
    (e: React.MouseEvent) => {
      if (clickAction === "open-modal") {
        // NOTE: noscript環境でなるべく正しく動くようにLinkのままpreventDefaultしている。
        // これが本当正しいのかはわからない。
        e.preventDefault();
        void openNoteInModal(bookRef, noteId);
      }
    },
    [bookRef, noteId, clickAction],
  );
};

export const NoteOverview: React.FC<{
  bookId: BookId;
  noteId: NoteId;
  clickAction?: ClickAction;
}> = ({ bookId, noteId, clickAction }) => {
  const book = useBook(bookId);
  const note = useNote(noteId);
  const handleClick = useNoteOverviewAction(
    book == null ? ("" as BookRef) : bookRefOf(book),
    noteId,
    clickAction,
  );

  if (book == null || note == null) return null;

  return (
    <article
      data-note-id={noteId}
      className={style({
        minWidth: MIN_NOTE_WIDTH,
        minHeight: "8em",
        display: "flex",
        flexDirection: "column",
        paddingBlock: "0.25em",
        backgroundColor: vars.color.bg.block,
        color: theme("note-text"),
        background: theme("note-bg"),
        position: "relative",
        overflow: "hidden",
      })}
    >
      <Link
        to="/books/$book-ref/$note-id"
        params={{ "book-ref": bookRefOf(book), "note-id": noteId }}
        onClick={handleClick}
        className=":uno: absolute inset-0"
      >
        <span className={visuallyHidden}>Open note.</span>
      </Link>
      <NoteContents contents={note.contents} />
      <TagList tags={note.tags} className=":uno: absolute pos-bottom-1 mx-2" />
    </article>
  );
};
