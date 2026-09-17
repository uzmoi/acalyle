import type { BookId } from "#/entities/book";
import { type NoteId, useNote } from "#/entities/note";
import { EditableNote } from "#/features/editable-note";

export const Note: React.FC<{
  bookId: BookId;
  noteId: NoteId;
}> = ({ bookId, noteId }) => {
  const note = useNote(noteId);

  return <EditableNote bookId={bookId} note={note} />;
};
