import { type NoteId, useNote } from "~/entities/note";
import { NoteBody } from "./body";

export const FullNote: React.FC<{
  noteId: NoteId;
}> = ({ noteId }) => {
  const note = useNote(noteId);

  return (
    <article
      data-note-id={noteId}
      data-note-tags={note.tags.join(" ")}
      className=":uno: min-h-32 min-w-sm"
    >
      {/* <NoteHeader bookRef={bookRef} note={note} /> */}
      <NoteBody noteId={noteId} contents={note.contents} />
    </article>
  );
};
