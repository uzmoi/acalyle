import { cx, style } from "@acalyle/css";
import { theme, vars } from "@acalyle/ui";
import { type Tag as TagType, parseTag } from "../model";

export const Tag: React.FC<{
  tag: TagType;
}> = ({ tag: tagString }) => {
  const tag = parseTag(tagString);

  if (tag == null) return;

  return (
    <span
      className={cx(
        ":uno: tag inline-block max-w-sm overflow-hidden text-ellipsis b rounded b-solid px-1 py-0.5 align-top text-xs",
        style({
          fontFamily: vars.font.mono,
          color: theme("tag-text"),
          background: theme("tag-bg"),
          borderColor: theme("tag-outline"),
        }),
      )}
      data-symbol={tag.symbol}
      data-prop={tag.prop}
    >
      <span>{tag.symbol}</span>
      {tag.prop && ":"}
      {tag.prop && <span>{tag.prop}</span>}
    </span>
  );
};
