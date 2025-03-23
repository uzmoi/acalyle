import type { Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import { testingLibrary } from "./testing-library";
import { OFF } from "./util";

export const react: Linter.Config[] = [
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": OFF,
    },
  },
  testingLibrary("react"),
];
