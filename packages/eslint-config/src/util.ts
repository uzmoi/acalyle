import type { Linter } from "eslint";

export const always = "always";
export const never = "never";

export const OFF = "off";
export const WARN = "warn";
export const warn = (...options: unknown[]): Linter.RuleEntry => [
    WARN,
    ...options,
];
export const ERROR = "error";
export const error = (...options: unknown[]): Linter.RuleEntry => [
    ERROR,
    ...options,
];

export const memoize = <T, U>(f: (arg: T) => U) => {
    const cache = new Map<T, U>();
    return (arg: T): U => {
        if (!cache.has(arg)) {
            cache.set(arg, f(arg));
        }
        return cache.get(arg)!;
    };
};

export const mapEntries = <T, U>(
    object: Record<string, T>,
    mapfn: (key: string, value: T) => readonly [string, U],
) => {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => mapfn(key, value)),
    );
};

export const replacePluginName = (
    rules: Partial<Linter.RulesRecord>,
    plugins: Record<string, string>,
): Linter.RulesRecord => {
    const regex = new RegExp(`^${Object.keys(plugins).join("|")}\\/`);
    const resolve = (plugin: string) => `${plugins[plugin] ?? ""}/`;
    return mapEntries(rules, (ruleName, ruleEntry) => [
        ruleName.replace(regex, resolve),
        ruleEntry,
    ]) as Linter.RulesRecord;
};

export const replaceWarn = (
    rules: Partial<Linter.RulesRecord>,
): Linter.RulesRecord => {
    return mapEntries(rules, (ruleName, entry) => [
        ruleName,
        entry === ERROR ? WARN : entry,
    ]) as Linter.RulesRecord;
};

const asArray = <T>(
    value: T | readonly T[] | null | undefined,
): readonly T[] =>
    Array.isArray(value) ? value : value == null ? [] : [value as T];

export const extendsRules = (
    configs: Record<string, Linter.Config>,
    configNames: readonly string[],
    { warn }: { warn?: (configName: string) => boolean } = {},
) => {
    const rules: Partial<Linter.RulesRecord> = {};
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
            config.rules = replaceWarn(config.rules);
        }
        Object.assign(rules, extendConfigs, config.rules);
    }
    return rules;
};
