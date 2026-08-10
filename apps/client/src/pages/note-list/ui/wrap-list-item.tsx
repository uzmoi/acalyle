import { theme, visuallyHidden } from "@acalyle/ui";
import { cx, style } from "asarina";
import { useCallback } from "react";
import { type Book, bookRefOf } from "#entities/book";
import { type NoteId, TagList, useNote } from "#entities/note";
import { Link } from "#shared/ui";
// eslint-disable-next-line import-access/jsdoc
import { NoteContents } from "~/entities/note/ui/contents";
import { openNoteInModal } from "~/features/note-modal";

export const NoteWarpListItem: React.FC<{
  book: Book;
  noteId: NoteId;
}> = ({ book, noteId }) => {
  const note = useNote(noteId);

  const handleClickLink = useCallback(
    (e: React.MouseEvent) => {
      // NOTE: noscript環境でなるべく正しく動くようにLinkのままpreventDefaultしている。
      // これが本当正しいのかはわからない。
      e.preventDefault();
      void openNoteInModal(bookRefOf(book), book.id, noteId);
    },
    [book, noteId],
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
        to="/books/$bookRef/$noteId"
        params={{ bookRef: bookRefOf(book), noteId }}
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
