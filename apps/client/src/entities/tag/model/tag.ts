import type { Tag, TagObject, TagSymbol } from "./types";

const TAG_INVALID_CHARACTER_RE = /\p{Cc}/v;

export const parseTag = (tag: string): TagObject | null => {
  // 空文字列とhead文字のみの文字列を弾く
  // 無効な文字が入った文字列を弾く
  if (tag.length <= 1 || TAG_INVALID_CHARACTER_RE.test(tag)) return null;

  const head = tag.charAt(0);
  if (head !== "#" && head !== "@" && head !== "*") return null;

  const propDelimiterIndex = tag.indexOf(":", 1);
  if (propDelimiterIndex === 1) return null;

  return propDelimiterIndex === -1 ?
      {
        symbol: tag as TagSymbol,
        prop: undefined,
      }
    : {
        symbol: tag.slice(0, propDelimiterIndex) as TagSymbol,
        prop: tag.slice(propDelimiterIndex + 1),
      };
};

export const tagToString = (tag: TagObject): Tag =>
  tag.prop == null ? tag.symbol : (`${tag.symbol}:${tag.prop}` as Tag);
