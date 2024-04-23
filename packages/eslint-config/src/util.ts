import { JSONSchema4 } from "@typescript-eslint/utils/json-schema";
import { ClassicConfig } from "@typescript-eslint/utils/ts-eslint";
import { WeakMeta } from "emnorst";
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

export const replaceWarn = (rules: Linter.RulesRecord): Linter.RulesRecord => {
    return mapEntries(rules, (ruleName, entry) => [
        ruleName,
        Array.isArray(entry) && entry[0] === ERROR ?
            [WARN, ...(entry as unknown[]).slice(1)]
        : entry === ERROR ? WARN
        : entry,
    ]);
};

const asArray = <T>(
    value: T | readonly T[] | null | undefined,
): readonly T[] =>
    Array.isArray(value) ? value
    : value == null ? []
    : [value as T];

export const extendsRules = (
    configs: Record<string, ClassicConfig.Config>,
    configNames: readonly string[],
    { warn }: { warn?: (configName: string) => boolean } = {},
): Linter.RulesRecord => {
    const rules: Linter.RulesRecord = {};
    for (const configName of configNames) {
        const config = { ...configs[configName] };

        const extendConfigNames = asArray(config.extends).map(name =>
            name.replace(/^.+\//, ""),
        );
        const extendConfigs = extendsRules(configs, extendConfigNames);

        if (config.overrides) {
            Object.assign(
                (config.rules ??= {}),
                ...config.overrides.map(override => override.rules),
            );
        }

        if (config.rules && warn?.(configName)) {
            config.rules = replaceWarn(unPartial(config.rules));
        }
        Object.assign(rules, extendConfigs, config.rules);
    }
    return rules;
};

// TODO: emnorstのWeakMetaを直す
export type JSONSchema<T = unknown> = WeakMeta<JSONSchema4, T> & { __?: T };

export type RuleOptions<T> = T extends JSONSchema<infer U> ? U : never;

export const jsonSchema = {
    object: <T>(properties: {
        [P in keyof T]: JSONSchema<T[P]>;
    }): JSONSchema<Partial<T>> => ({ type: "object", properties }),
    array: <T>(items: JSONSchema<T>): JSONSchema<T[]> => ({
        type: "array",
        items,
    }),
    boolean: (): JSONSchema<boolean> => ({ type: "boolean" }),
    string: (schema?: {
        maxLength?: number;
        minLength?: number;
        pattern?: string;
    }): JSONSchema<string> => ({
        type: "string",
        ...schema,
    }),
};
