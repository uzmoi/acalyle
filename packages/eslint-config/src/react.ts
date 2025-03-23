import type { Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import { testingLibrary } from "./testing-library";

export const react: Linter.Config[] = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parserOptions: { jsxPragma: null },
    },
  },
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": "off",
    },
  },
  testingLibrary("react"),
];
