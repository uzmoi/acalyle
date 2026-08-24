import * as v from "valibot";

export interface Theme extends Record<ThemeTokenKey, ThemeTokenValue> {}

export type ThemeTokenValue = `$${ThemeTokenKey}` | Color;

export const isLinkTokenValue = (
  value: ThemeTokenValue,
): value is `$${ThemeTokenKey}` => value.startsWith("$");

export type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number];

export const THEME_TOKEN_KEYS = [
  "app-bg",
  "ui-text",
  "ui-muted-text",
  "ui-border",
  "ui-control-bg",
  "book-cover-bg",
  "book-cover-text",
  "note-bg",
  "note-text",
  "tag-bg",
  "tag-text",
  "tag-outline",
] as const;

const COLORS = {
  white: "#ffffff",
  lightgray: "#c0c0c0",
  gray: "#808080",
  darkgray: "#404040",
  black: "#000000",
} as const satisfies Record<string, Color>;

export const FALLBACK_THEME: Theme = {
  "app-bg": COLORS.white,
  "ui-text": COLORS.black,
  "ui-muted-text": COLORS.gray,
  "ui-border": COLORS.gray,
  "ui-control-bg": COLORS.lightgray,
  "book-cover-bg": COLORS.lightgray,
  "book-cover-text": "$ui-text",
  "note-bg": "$app-bg",
  "note-text": "$ui-text",
  "tag-bg": "$app-bg",
  "tag-text": "$ui-text",
  "tag-outline": "$ui-border",
};

const Value = v.union([
  v.picklist(THEME_TOKEN_KEYS.map(key => `$${key}` as const)),
  v.literal("transparent"),
  v.pipe(
    v.string(),
    v.hexColor(),
    v.custom<`#${string}`>(() => true),
  ),
]);

export const Theme = v.record(v.picklist(THEME_TOKEN_KEYS), Value);

export type Color = `#${string}` | "transparent";

export const getColor = (theme: Theme, key: ThemeTokenKey): Color => {
  const path = new Set([key]);
  let value = theme[key];

  while (isLinkTokenValue(value)) {
    const refKey = value.slice(1) as ThemeTokenKey;
    if (path.has(refKey)) return getColor(FALLBACK_THEME, key);
    path.add(refKey);
    value = theme[refKey];
  }

  return value;
};

export const normalizeColor = (value: Color): Color => {
  if (value.startsWith("#")) {
    // #rgb0 or #rrggbb00
    if (/^#(?:.{3}0|.{6}00)$/.test(value)) {
      return "transparent";
    }

    // #rgb or #rgba
    // oxlint-disable-next-line no-magic-numbers
    if (value.length < 6) {
      // 英数字を `$&` にキャプチャして繰り返す。
      return value.replaceAll(/\w/g, "$&$&") as `#${string}`;
    }
  }

  return value;
};
