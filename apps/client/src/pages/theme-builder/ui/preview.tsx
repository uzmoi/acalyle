import { type Theme, createTheme } from "@acalyle/ui";
import { cx, style } from "asarina";
import { themeVar } from "#/entities/theme";
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
        <BookShelf books={dummyBooks} />
      : null}
    </div>
  );
};
