import type { Linter } from "eslint";

export const always = "always";
export const never = "never";

export const OFF = "off";
export const WARN = "warn";
export const warn = <T extends unknown[]>(
  ...options: T
): Linter.RuleEntry<T> => [WARN, ...options];
export const ERROR = "error";
export const error = <T extends unknown[]>(
  ...options: T
): Linter.RuleEntry<T> => [ERROR, ...options];

export const omit = <T extends object, const K extends PropertyKey>(
  object: T,
  keys: readonly K[],
): Omit<T, K> =>
  Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;

type Entry<T extends object> = {
  [P in keyof T]: [key: P, value: T[P]];
}[keyof T];

export const mapEntries = <T extends object, U extends object>(
  object: T,
  mapfn: (...x: Entry<T>) => Entry<U>,
): U => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) =>
      mapfn(key as never, value as never),
    ),
  ) as U;
};

export const replaceWarn = (
  rules: Partial<Linter.RulesRecord>,
): Linter.RulesRecord => {
  return mapEntries(rules, (ruleName, entry) => [
    ruleName,
    Array.isArray(entry) && entry[0] === ERROR ?
      [WARN, ...(entry as unknown[]).slice(1)]
    : entry === ERROR ? WARN
    : (entry ?? OFF),
  ]);
};
