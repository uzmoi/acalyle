import { type Theme, createTheme } from "@acalyle/ui";
import { cx, style } from "asarina";
import { tth } from "#/entities/theme";
import { BookShelf } from "#/widgets/book-shelf";
import { DetailedNoteView } from "#/widgets/note";
import {
  type PreviewPage,
  dummyBookId,
  dummyBooks,
  dummyNote,
} from "../model/preview";

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
              text: tth("$ui-text"),
              bg: tth("$ui-control-bg"),
              outline: tth("$ui-border"),
            },
          } as Theme),
          ...tth.style("app-bg", "ui-text"),
        }),
      )}
    >
      {page === "note" ?
        <DetailedNoteView bookId={dummyBookId} note={dummyNote} />
      : page === "bool-shelf" ?
        <BookShelf books={dummyBooks} />
      : null}
    </div>
  );
};
