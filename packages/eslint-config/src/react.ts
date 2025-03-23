import type { Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import { testingLibrary } from "./testing-library";
import { tsExts } from "./util";

export const react: Linter.FlatConfig[] = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parserOptions: { jsxPragma: null },
    },
  },
  {
    files: [`**/*.${tsExts}`],
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": "off",
    },
  },
  testingLibrary("react"),
];
