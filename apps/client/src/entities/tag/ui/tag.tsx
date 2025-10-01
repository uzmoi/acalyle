import { NoteTag } from "@acalyle/core";
import { cx, style } from "@acalyle/css";
import { theme, vars } from "@acalyle/ui";
import type { Tag as TagType } from "../model";

export const Tag: React.FC<{
  tag: TagType;
}> = ({ tag: tagString }) => {
  const tag = NoteTag.fromString(tagString);

  if (tag == null) return;

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
