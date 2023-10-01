import type { Linter } from "eslint";
import { acalyleConfig } from "./acalyle";
import { importConfig } from "./import";
import { react } from "./react";
import {
    typescript,
    typescriptCustom,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    typescriptStrict,
} from "./typescript";

export { acalylePlugin } from "./acalyle";
export * from "./util";

export const configs = {
    import: importConfig,
    react,
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    typescriptStrict,
    typescriptCustom,
    acalyle: acalyleConfig,
} satisfies Record<string, Linter.FlatConfig | readonly Linter.FlatConfig[]>;
