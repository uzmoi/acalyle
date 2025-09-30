import type { Note } from "~/entities/note";
import { NoteBody } from "./body";

export const FullNote: React.FC<{
  note: Note;
}> = ({ note }) => {
  return (
    <article
      data-note-id={note.id}
      data-note-tags={note.tags.join(" ")}
      className=":uno: min-h-32 min-w-sm"
    >
      {/* <NoteHeader bookRef={bookRef} note={note} /> */}
      <NoteBody noteId={note.id} contents={note.contents} />
    </article>
  );
};
