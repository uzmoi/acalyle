import type { NoteTag } from "@acalyle/core";
import { cx, style } from "@acalyle/css";
import { theme, vars } from "@acalyle/ui";

export const Tag: React.FC<{
  tag: NoteTag;
}> = ({ tag }) => {
  return (
    <span
      className={cx(
        ":uno: inline-block max-w-sm overflow-hidden text-ellipsis b rounded b-solid px-1 py-0.5 text-xs",
        style({
          fontFamily: vars.font.mono,
          color: theme("tag-text"),
          background: theme("tag-bg"),
          borderColor: theme("tag-outline"),
        }),
      )}
      data-tag-type={tag.type}
    >
      <span>{tag.symbol}</span>
      {tag.prop && ":"}
      {tag.prop && <span>{tag.prop}</span>}
    </span>
  );
};
