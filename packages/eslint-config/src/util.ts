import type { Linter } from "eslint";

export const tsExts = "{ts,mts,cts,tsx}";

export const always = "always";
export const never = "never";

export const OFF = "off";
export const WARN = "warn";
export const warn = <T extends unknown[]>(
  ...options: T
): Linter.RuleLevelAndOptions<T> => [WARN, ...options];
export const ERROR = "error";
export const error = <T extends unknown[]>(
  ...options: T
): Linter.RuleLevelAndOptions<T> => [ERROR, ...options];

export const memoize = <T, U>(f: (arg: T) => U) => {
  const cache = new Map<T, U>();
  return (arg: T): U => {
    if (!cache.has(arg)) {
      cache.set(arg, f(arg));
    }
    return cache.get(arg)!;
  };
};

export const unPartial = <T>(object: Partial<T>): Required<T> =>
  object as Required<T>;

type Entry<T extends object> = {
  [P in keyof T]: [key: P, value: T[P]];
}[keyof T];

export const omit = <T extends object, const K extends PropertyKey>(
  object: T,
  keys: readonly K[],
) =>
  Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;

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

export const replacePluginName = (
  rules: Linter.RulesRecord,
  plugins: Record<string, string>,
): Linter.RulesRecord => {
  const regex = new RegExp(`^${Object.keys(plugins).join("|")}\\/`);
  const resolve = (plugin: string) => `${plugins[plugin] ?? ""}/`;
  return mapEntries(rules, (ruleName, ruleEntry) => [
    ruleName.replace(regex, resolve),
    ruleEntry,
  ]);
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

export const asArray = <T>(value: T | readonly T[] | null | undefined): T[] =>
  Array.isArray(value) ? [...value]
  : value == null ? []
  : [value as T];

export const extendsFlatRules = (
  plugin: { configs?: Record<string, unknown> },
  configNames: readonly string[],
  mapRules: (
    rules: Linter.RulesRecord,
    configName: string,
  ) => Linter.RulesRecord,
) => {
  const result: Linter.RulesRecord = {};
  for (const configName of configNames) {
    const configs = asArray(
      plugin.configs?.[configName],
    ) as Linter.FlatConfig[];
    const lastConfig = configs.pop();
    Object.assign(
      result,
      ...configs.map(config => config.rules),
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      mapRules(lastConfig?.rules!, configName),
    );
  }
  return result;
};
