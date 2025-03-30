import { cx, style } from "@acalyle/css";
import { visuallyHidden } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import type { BookRef } from "~/entities/book";
import { type NoteId, useNote, TagList } from "~/entities/note";
// eslint-disable-next-line import-access/jsdoc
import { NoteContents } from "~/entities/note/ui/contents";
import { openNoteInModal } from "~/features/note-modal";
import { theme } from "~/theme";

export const NoteWarpListItem: React.FC<{
  bookRef: BookRef;
  noteId: NoteId;
}> = ({ bookRef, noteId }) => {
  const note = useNote(noteId);

  const handleClickLink = useCallback(
    (e: React.MouseEvent) => {
      // NOTE: noscript環境でなるべく正しく動くようにLinkのままpreventDefaultしている。
      // これが本当正しいのかはわからない。
      e.preventDefault();
      void openNoteInModal(bookRef, noteId);
    },
    [bookRef, noteId],
  );

  return (
    <article
      data-note-id={noteId}
      className={cx(
        ":uno: relative overflow-hidden b b-gray-8 b-solid rounded p-2",
        style({
          color: theme("note-text"),
          background: theme("note-bg"),
        }),
      )}
    >
      <Link
        to="/books/$book-ref/$note-id"
        params={{ "book-ref": bookRef, "note-id": noteId }}
        onClick={handleClickLink}
        className=":uno: absolute inset-0"
      >
        <span className={visuallyHidden}>Open note.</span>
      </Link>
      <NoteContents contents={note.contents} />
      <TagList tags={note.tags} className=":uno: absolute pos-bottom-1 mx-2" />
    </article>
  );
};
