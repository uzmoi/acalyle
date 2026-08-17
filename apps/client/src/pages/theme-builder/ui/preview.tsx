import { type Theme, createTheme } from "@acalyle/ui";
import { cx, style } from "asarina";
import type { BookId } from "#/entities/book";
import type { Note, NoteId } from "#/entities/note";
import type { Tag } from "#/entities/tag";
import { themeVar } from "#/entities/theme";
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
          // 移行するまでの繋ぎ
          ...createTheme({
            control: {
              text: themeVar("ui-text"),
              bg: themeVar("ui-control-bg"),
              outline: themeVar("ui-border"),
            },
            book_cover: {
              text: themeVar("book-cover-text"),
              bg: themeVar("book-cover-bg"),
            },
            note: {
              text: themeVar("note-text"),
              bg: themeVar("note-bg"),
            },
            tag: {
              text: themeVar("tag-text"),
              bg: themeVar("tag-bg"),
            },
          } as Theme),
          backgroundColor: themeVar("app-bg"),
          color: themeVar("ui-text"),
        }),
      )}
    >
      <DetailedNoteView bookId={dummyBookId} note={dummyNote} />
    </div>
  );
};
