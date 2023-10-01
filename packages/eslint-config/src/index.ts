import type { Linter } from "eslint";
import { acalyleConfig } from "./acalyle";
import { importConfig } from "./import";
import { react } from "./react";
import { typescript, typescriptCustom } from "./typescript";

export { acalylePlugin } from "./acalyle";
export * from "./util";

export const configs = {
    import: importConfig,
    react,
    typescript,
    typescriptCustom,
    acalyle: acalyleConfig,
} satisfies Record<
    string,
    | Linter.FlatConfig
    | readonly Linter.FlatConfig[]
    | (() => Linter.FlatConfig | readonly Linter.FlatConfig[])
>;
