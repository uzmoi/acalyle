import { cx, style } from "asarina";
import type { BookId } from "#/entities/book";
import type { Note, NoteId } from "#/entities/note";
import type { Tag } from "#/entities/tag";
import { DetailedNoteView } from "#/widgets/note";

const dummyBookId = "B0000000000000000" as BookId;
const dummyNote: Note = {
  id: "N0000000000000000" as NoteId,
  contents: "ほげほげふがふが。",
  tags: ["#tag" as Tag],
  createdAt: "1970-01-01T00:00:00Z",
  updatedAt: "1970-01-01T00:00:00Z",
};

export const Preview: React.FC = () => {
  return (
    <div
      className={cx(
        ":uno: p-4 overflow-auto h-full",
        style({
          backgroundColor: "var(--app-bg)",
          color: "var(--ui-text)",
        }),
      )}
    >
      <DetailedNoteView bookId={dummyBookId} note={dummyNote} />
    </div>
  );
};
