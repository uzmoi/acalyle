import { noModuleSideEffect } from "./no-module-side-effect";
import { preferStringLiteral } from "./prefer-string-literal";

export const rules = {
    "prefer-string-literal": preferStringLiteral,
    "no-module-side-effect": noModuleSideEffect,
};
