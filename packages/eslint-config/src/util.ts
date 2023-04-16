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
