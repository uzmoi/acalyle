import type { NoteTag } from "@acalyle/core";
import { style } from "@acalyle/css";
import { vars, theme } from "@acalyle/ui";

export const Tag: React.FC<{
  tag: NoteTag;
}> = ({ tag }) => {
  return (
    <span
      className={style({
        display: "inline-block",
        padding: "0.125rem 0.25rem",
        lineHeight: 1,
        fontSize: "0.75em",
        fontFamily: vars.font.mono,
        color: theme("tag-text"),
        background: theme("tag-bg"),
        border: "1px solid",
        borderColor: theme("tag-outline"),
        borderRadius: vars.radius.block,
      })}
      data-tag-type={tag.type}
    >
      <span>{tag.symbol}</span>
      {tag.prop && ":"}
      {tag.prop && <span>{tag.prop}</span>}
    </span>
  );
};
