import type { Linter } from "eslint";
import { acalyleConfig } from "./acalyle";
import { importConfig } from "./import";
import { react } from "./react";
import { recommended } from "./recommended";
import { testingLibrary } from "./testing-library";
import { typescript } from "./typescript";

export { acalylePlugin } from "./acalyle";
export { type Options, createConfig } from "./create-config";
export type { TestingLibraryLib } from "./testing-library";
export type { TypeScriptESLintConfigName } from "./typescript";
export * from "./util";

export const configs = {
    recommended,
    import: importConfig,
    react,
    typescript,
    acalyle: acalyleConfig,
    testingLibrary,
} satisfies Record<
    string,
    | Linter.FlatConfig
    | readonly Linter.FlatConfig[]
    | ((...args: never) => Linter.FlatConfig | readonly Linter.FlatConfig[])
>;
