import hash from "@emotion/hash";
import {
  THEME_TOKEN_KEYS,
  type Theme,
  type ThemeTokenKey,
  getColor,
} from "./theme";

export const varName = (key: string): `--${string}` =>
  // oxlint-disable-next-line no-magic-numbers
  `--${import.meta.env.PROD ? hash(key).slice(-5) : key}`;

const themeVar = (key: ThemeTokenKey): `var(--${string})` =>
  `var(${varName(key)})`;

type StripSuffix<Suffix extends string, T extends string> =
  T extends `${infer A}${Suffix}` ? A : never;

type TTHDelimiter = " " | "," | ")";
type TTH<T extends string> =
  T extends `${infer A}$${infer B}` ?
    B extends `${ThemeTokenKey}${infer C}` ?
      `${A}$${StripSuffix<C, B>}${C extends `${TTHDelimiter}${string}` | "" ? TTH<C> : ` ${C}`}`
    : `${A}$${ThemeTokenKey}${B extends `${TTHDelimiter}${string}` | "" ? B : ` ${B}`}`
  : T;

// Theme Token Helper
export const tth = <T extends string>(source: TTH<T>): string =>
  source.replaceAll(/\$([a-z-]+)/g, (_, key) => themeVar(key as ThemeTokenKey));

tth.style = (
  ...vars: Extract<ThemeTokenKey, `${string}-${"bg" | "text"}`>[]
): Partial<Record<"backgroundColor" | "color", `var(--${string})`>> =>
  Object.fromEntries(
    vars.map(v => {
      const property = v.endsWith("-bg") ? "backgroundColor" : "color";
      return [property, themeVar(v)];
    }),
  );

export const createThemeDefinitionStyle = (
  theme: Theme,
): Record<`--${string}`, string> => {
  return Object.fromEntries(
    THEME_TOKEN_KEYS.map(key => [varName(key), getColor(theme, key)]),
  );
};
