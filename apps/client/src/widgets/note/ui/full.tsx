import { cx, style } from "@acalyle/css";
import { Alert, vars } from "@acalyle/ui";
import { BiError } from "react-icons/bi";
import { type NoteId, useNote } from "~/entities/note";
import { NoteBody } from "./body";

export const FullNote: React.FC<{
  noteId: NoteId;
}> = ({ noteId }) => {
  const note = useNote(noteId);

  if (note == null) {
    return (
      // REVIEW: role="alert"ってこういう所で使っていいものなのか
      <Alert type="error">
        <BiError
          className={cx(
            ":uno: text-7 mr-1",
            style({ color: vars.color.danger }),
          )}
        />
        <span className=":uno: align-middle">Note not found!</span>
        <p>
          note id: <span className=":uno: select-all">{noteId}</span>
        </p>
      </Alert>
    );
  }

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
