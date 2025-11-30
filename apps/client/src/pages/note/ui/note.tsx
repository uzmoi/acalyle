import type { BookId } from "#entities/book";
import { type NoteId, useNote } from "#entities/note";
import { FullNote } from "#widgets/note";

export const Note: React.FC<{
  bookId: BookId;
  noteId: NoteId;
}> = ({ bookId, noteId }) => {
  const note = useNote(noteId);

  return <FullNote bookId={bookId} note={note} />;
};
