import type { Linter } from "eslint";
import { importConfig } from "./import";
import { react } from "./react";
import {
    typescript,
    typescriptCustom,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
} from "./typescript";

export const configs = {
    import: importConfig,
    react,
    typescript,
    typescriptRecommended,
    typescriptRecommendedRequiringTypeChecking,
    typescriptCustom,
} satisfies Record<string, Linter.FlatConfig | readonly Linter.FlatConfig[]>;
