import { type Theme, createTheme } from "@acalyle/ui";
import { cx, style } from "asarina";
import type { Book, BookHandle, BookId } from "#/entities/book";
import type { Note, NoteId } from "#/entities/note";
import type { Tag } from "#/entities/tag";
import { themeVar } from "#/entities/theme";
import { DetailedNoteView } from "#/widgets/note";
import { BookShelf } from "~/pages/book-list/ui/shelf";
import type { PreviewPage } from "../model/preview";

const dummyBookId = "B0000000000000000" as BookId;
const dummyNote: Note = {
  id: "N0000000000000000" as NoteId,
  contents: "ほげほげふがふが。",
  tags: ["#tag" as Tag],
  createdAt: "1970-01-01T00:00:00Z",
  updatedAt: "1970-01-01T00:00:00Z",
};

const dummyBook: Book = {
  id: dummyBookId,
  handle: "handle" as BookHandle,
  title: "Title",
  description: "This is a description.",
  thumbnail: "color:#ffffff",
};

export const Preview: React.FC<{
  page: PreviewPage;
}> = ({ page }) => {
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
          } as Theme),
          backgroundColor: themeVar("app-bg"),
          color: themeVar("ui-text"),
        }),
      )}
    >
      {page === "note" ?
        <DetailedNoteView bookId={dummyBookId} note={dummyNote} />
      : page === "bool-shelf" ?
        <BookShelf books={[dummyBook]} />
      : null}
    </div>
  );
};
