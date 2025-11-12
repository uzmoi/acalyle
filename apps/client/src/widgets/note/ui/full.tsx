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
      data-tags={note.tags.join(" ")}
      className=":uno: mx-auto min-w-sm max-w-screen-xl"
    >
      <NoteHeader bookId={bookId} note={note} />
      <NoteBody bookId={bookId} note={note} />
    </article>
  );
};
