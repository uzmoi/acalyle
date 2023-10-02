import type { Linter } from "eslint";
import { acalyleConfig } from "./acalyle";
import { importConfig } from "./import";
import { react } from "./react";
import { testingLibrary } from "./testing-library";
import { typescript, typescriptCustom } from "./typescript";
import { unicorn } from "./unicorn";

export { acalylePlugin } from "./acalyle";
export * from "./util";

export const configs = {
    import: importConfig,
    react,
    typescript,
    typescriptCustom,
    acalyle: acalyleConfig,
    unicorn,
    testingLibrary,
} satisfies Record<
    string,
    | Linter.FlatConfig
    | readonly Linter.FlatConfig[]
    | ((...args: never) => Linter.FlatConfig | readonly Linter.FlatConfig[])
>;
