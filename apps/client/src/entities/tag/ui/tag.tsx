import { cx, style } from "asarina";
import { themeVar } from "#/entities/theme";
import type { Tag as TagType } from "../model/types";
import { parseTag } from "../model/tag";

export const Tag: React.FC<{
  tag: TagType;
}> = ({ tag: tagString }) => {
  const tag = parseTag(tagString);

  if (tag == null) return;

  return (
    <span
      className={cx(
        ":uno: tag inline-block max-w-sm overflow-hidden text-ellipsis b rounded b-solid px-1 py-0.5 align-top text-xs font-mono",
        style({
          color: themeVar("tag-text"),
          background: themeVar("tag-bg"),
          borderColor: themeVar("tag-outline"),
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
