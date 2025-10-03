import { varName } from "@acalyle/ui";
import type { TagStyle, TagSymbol } from "./types";

const toCss = (
  selector: string,
  style: Record<string, string | null | undefined>,
): string =>
  `${selector}{${Object.entries(style)
    .map(([key, value]) => (value == null ? null : `${key}:${value};`))
    .filter(Boolean)
    .join("")}}`;

const validateCssValue = (property: string, value: string): string | null =>
  CSS.supports(property, value) ? value : null;

export const printTagStyleCss = (
  symbol: TagSymbol,
  style: TagStyle,
): string => {
  // <string-token> 内でエスケープが必要なのは '\' と '"' と newline。
  // newline はタグの構文として無効なため、'\' と '"' のみエスケープすれば良い。
  // https://www.w3.org/TR/selectors-4/#attribute-representation
  // https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
  const selector = `[data-tag-symbol="${symbol.replaceAll(/["\\]/g, "\\$&")}"]`;

  return toCss(selector, {
    [varName("tag-text")]: validateCssValue("color", style.fg),
    [varName("tag-bg")]: validateCssValue("background", style.bg),
    [varName("tag-outline")]: validateCssValue("color", style.outline),
  });
};
