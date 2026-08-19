import { cx, style } from "asarina";
import { themeVar } from "#/entities/theme";

export const NoteContents: React.FC<{
  contents: string;
}> = ({ contents }) => {
  return (
    <div
      className={cx(
        ":uno: py-1 px-3 min-h-4 ws-pre-wrap break-all",
        style({
          color: themeVar("note-text"),
          background: themeVar("note-bg"),
        }),
      )}
    >
      {contents}
    </div>
  );
};
