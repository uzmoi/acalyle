import hash from "@emotion/hash";
import {
  THEME_TOKEN_KEYS,
  type Theme,
  type ThemeTokenKey,
  getHexColor,
} from "./theme";

export const varName = (key: string): `--${string}` =>
  // oxlint-disable-next-line no-magic-numbers
  `--${import.meta.env.PROD ? hash(key).slice(-5) : key}`;

export const themeVar = (key: ThemeTokenKey): `var(--${string})` =>
  `var(${varName(key)})`;

export const createThemeDefinitionStyle = (
  theme: Theme,
): Record<`--${string}`, string> => {
  return Object.fromEntries(
    THEME_TOKEN_KEYS.map(key => [varName(key), getHexColor(theme, key)]),
  );
};
