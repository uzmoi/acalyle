import type { Linter } from "eslint";
import { importConfig } from "./import";
import { react } from "./react";
import { recommended } from "./recommended";
import { type TypeScriptESLintConfigName, typescript } from "./typescript";

export type Options = Partial<{
  ignores: string[];
  ts: TypeScriptESLintConfigName[];
  tsProject: string[];
  react: boolean;
}>;

export const createConfig = ({
  ignores = [],
  ts = ["recommendedTypeChecked", "stylisticTypeChecked"],
  tsProject = ["tsconfig.json", "tsconfig.*.json"],
  react: useReactConfig,
}: Options = {}): Linter.FlatConfig[] => [
  {
    ignores: [
      "**/{dist,coverage,__generated__,storybook-static}/**",
      "**/__*",
      "**/*.log",
      "**/*.d.ts",
      "**/*.d.*.ts",
      ...ignores,
    ],
  },
  ...recommended,
  typescript(...ts),
  ...(useReactConfig ? react : []),
  ...importConfig,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
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
