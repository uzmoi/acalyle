export interface Theme extends Record<ThemeTokenKey, ThemeTokenValue> {}

export type ThemeTokenValue = `$${ThemeTokenKey}` | Color;

export type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number];

export const THEME_TOKEN_KEYS = [
  "app-bg",
  "ui-text",
  "ui-muted-text",
  "note-bg",
  "note-text",
] as const;

export const FALLBACK_THEME: Theme = {
  "app-bg": "white",
  "ui-text": "black",
  "ui-muted-text": "$ui-text",
  "note-bg": "$app-bg",
  "note-text": "$ui-text",
};

export type Color = HexColor | keyof typeof NAMED_COLORS;
export type HexColor = `#${string}`;

const NAMED_COLORS = {
  white: "#ffffff",
  black: "#000000",
  transparent: "#00000000",
} as const satisfies Record<string, HexColor>;

export const getHexColor = (theme: Theme, key: ThemeTokenKey): HexColor => {
  const path = new Set([key]);
  let value = theme[key];

  while (value.startsWith("$")) {
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
