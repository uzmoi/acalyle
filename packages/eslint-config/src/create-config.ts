import type { Linter } from "eslint";
import { globalIgnores } from "eslint/config";
import { importConfig } from "./import";
import { react } from "./react";
import { recommended } from "./recommended";
import { typescript } from "./typescript";

export type Options = Partial<{
  ignores: string[];
  tsProject: string[];
  react: boolean;
}>;

export const createConfig = ({
  ignores = [],
  tsProject = ["tsconfig.json", "tsconfig.*.json"],
  react: useReactConfig,
}: Options = {}): Linter.Config[] => [
  globalIgnores([
    "**/{dist,coverage,__generated__,storybook-static}/**",
    "**/__*",
    "**/*.log",
    "**/*.d.ts",
    "**/*.d.*.ts",
    ...ignores,
  ]),
  ...recommended,
  ...typescript,
  ...(useReactConfig ? react : []),
  ...importConfig,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: tsProject,
      },
    },
    settings: {
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs", ".jsx"],
      },
      "import/resolver": {
        typescript: { project: tsProject },
      },
    },
  },
];
