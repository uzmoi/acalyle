import { cx, style } from "@acalyle/css";
import { theme } from "~/theme";

export const NoteContents: React.FC<{
  contents: string;
}> = ({ contents }) => {
  return (
    <div
      className={cx(
        ":uno: py-1 px-3 min-h-4 ws-pre-wrap break-all",
        style({
          color: theme("note-text"),
          background: theme("note-bg"),
        }),
      )}
    >
      {contents}
    </div>
  );
};
