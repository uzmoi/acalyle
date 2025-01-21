import { style } from "@acalyle/css";
import { vars, visuallyHidden } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { useBook } from "~/book/ui/hook";
import { type Book, type BookId, bookRefOf } from "~/entities/book";
import type { ID } from "~/lib/graphql";
import { MIN_NOTE_WIDTH } from "~/note/ui/constants";
import { useNote } from "~/note/ui/hook";
import { theme } from "~/theme";
import { openNoteInModal } from "~/ui/modal";
import type { Note, NoteId } from "../model";
import { NoteContents } from "./contents";
import { TagList } from "./tag-list";

type ClickAction = "open-link" | "open-modal";

const useNoteOverviewAction = (
  bookId: BookId,
  noteId: NoteId,
  clickAction: ClickAction = "open-modal",
): ((e: React.MouseEvent) => void) => {
  return useCallback(
    (e: React.MouseEvent) => {
      if (clickAction === "open-modal") {
        // NOTE: noscript環境でなるべく正しく動くようにLinkのままpreventDefaultしている。
        // これが本当正しいのかはわからない。
        e.preventDefault();
        void openNoteInModal(bookId as string as ID, noteId as string as ID);
      }
    },
    [bookId, noteId, clickAction],
  );
};

export const NoteOverview: React.FC<{
  bookId: BookId;
  noteId: NoteId;
  clickAction?: ClickAction;
}> = ({ bookId, noteId, clickAction }) => {
  const book = useBook(bookId as string as ID) as Book | null;
  const note = useNote(noteId as string as ID) as Note | null;
  const handleClick = useNoteOverviewAction(bookId, noteId, clickAction);

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
        // TODO: ノートのページを追加したらパスを変更
        to="/books/$book-ref"
        params={{ "book-ref": bookRefOf(book) }} // "note-id": noteId
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
