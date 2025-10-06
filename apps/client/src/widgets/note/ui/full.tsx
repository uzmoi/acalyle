import type { BookId } from "#entities/book";
import type { Note } from "#entities/note";
import { NoteBody } from "./body";
import { NoteHeader } from "./header";

export const FullNote: React.FC<{
  bookId: BookId;
  note: Note;
}> = ({ bookId, note }) => {
  return (
    <article
      data-note-id={note.id}
      data-note-tags={note.tags.join(" ")}
      className=":uno: min-h-32 min-w-sm"
    >
      <NoteHeader bookId={bookId} note={note} />
      <NoteBody noteId={note.id} contents={note.contents} />
    </article>
  );
};
