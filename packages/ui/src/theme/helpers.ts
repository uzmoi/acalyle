import hash from "@emotion/hash";
import type { IfUnion } from "emnorst";
import type { Theme } from "./theme";

export const varName = (key: string): `--${string}` =>
  `--${import.meta.env.DEV ? key.replace(":", "-") : hash(key).slice(-5)}`;

export const theme = <
  S extends keyof Theme,
  K extends S extends S ? keyof Theme[S] : never,
>(
  key: IfUnion<S, S, `${S}-${K}`>,
  defaultValue?: string,
): `var(--${string})` =>
  defaultValue ?
    `var(${varName(key)}, ${defaultValue})`
  : `var(${varName(key)})`;

export const createTheme = (theme: Theme): Record<`--${string}`, string> => {
  const style: Record<`--${string}`, string> = {};

  for (const [scope, vars] of Object.entries(
    theme as unknown as Record<keyof Theme, Record<string, string>>,
  )) {
    for (const [key, value] of Object.entries(vars)) {
      style[varName(`${scope}-${key}`)] = value;
    }
  }

  return style;
};
