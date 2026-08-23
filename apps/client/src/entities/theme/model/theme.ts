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

export const FALLBACK_THEME: Theme = {
  "app-bg": "white",
  "ui-text": "black",
  "ui-muted-text": "gray",
  "ui-border": "gray",
  "ui-control-bg": "lightgray",
  "book-cover-bg": "lightgray",
  "book-cover-text": "$ui-text",
  "note-bg": "$app-bg",
  "note-text": "$ui-text",
  "tag-bg": "$app-bg",
  "tag-text": "$ui-text",
  "tag-outline": "$ui-border",
};

const Value = v.union([
  v.picklist(THEME_TOKEN_KEYS.map(key => `$${key}` as const)),
  v.picklist([
    "white",
    "lightgray",
    "gray",
    "darkgray",
    "black",
    "transparent",
  ]),
  v.pipe(
    v.string(),
    v.hexColor(),
    v.custom<`#${string}`>(() => true),
  ),
]);

export const Theme = v.record(v.picklist(THEME_TOKEN_KEYS), Value);

export type Color = HexColor | keyof typeof NAMED_COLORS;
export type HexColor = `#${string}`;

const NAMED_COLORS = {
  white: "#ffffff",
  lightgray: "#c0c0c0",
  gray: "#808080",
  darkgray: "#404040",
  black: "#000000",
  transparent: "#00000000",
} as const satisfies Record<string, HexColor>;

export const getHexColor = (theme: Theme, key: ThemeTokenKey): HexColor => {
  const path = new Set([key]);
  let value = theme[key];

  while (isLinkTokenValue(value)) {
    const refKey = value.slice(1) as ThemeTokenKey;
    if (path.has(refKey)) return getHexColor(FALLBACK_THEME, key);
    path.add(refKey);
    value = theme[refKey];
  }

  if (value.startsWith("#")) {
    return value;
  }

  return NAMED_COLORS[value];
};

declare global {
  interface String {
    startsWith<T extends string>(searchString: T): this is `${T}${string}`;
  }
}
