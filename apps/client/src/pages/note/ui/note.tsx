import type { BookId } from "#entities/book";
import { type NoteId, useNote } from "#entities/note";
import { DetailedNoteView } from "#widgets/note";

export const Note: React.FC<{
  bookId: BookId;
  noteId: NoteId;
}> = ({ bookId, noteId }) => {
  const note = useNote(noteId);

  return <DetailedNoteView bookId={bookId} note={note} />;
};
