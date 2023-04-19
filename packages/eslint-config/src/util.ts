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

export const mapEntries = <T, U>(
    object: Record<string, T>,
    mapfn: (key: string, value: T) => readonly [string, U],
) => {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => mapfn(key, value)),
    );
};

export const replacePluginName = (
    rules: Partial<Linter.RulesRecord> | undefined,
    plugins: Record<string, string>,
): Linter.RulesRecord | undefined => {
    const regex = new RegExp(`^${Object.keys(plugins).join("|")}\\/`);
    const resolve = (plugin: string) => `${plugins[plugin] ?? ""}/`;
    return (
        rules &&
        (mapEntries(rules, (ruleName, ruleEntry) => [
            ruleName.replace(regex, resolve),
            ruleEntry,
        ]) as Linter.RulesRecord | undefined)
    );
};
