import type { Linter } from "eslint";
import { importConfig } from "./import";
import { react } from "./react";
import {
    typescript,
    typescriptCustom,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    typescriptStrict,
} from "./typescript";

export * from "./util";

export const configs = {
    import: importConfig,
    react,
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    typescriptStrict,
    typescriptCustom,
} satisfies Record<string, Linter.FlatConfig | readonly Linter.FlatConfig[]>;
