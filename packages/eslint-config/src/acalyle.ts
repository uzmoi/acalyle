import type { ESLint, Linter } from "eslint";
import { rules } from "./rules";
import { WARN } from "./util";

export const acalylePlugin: ESLint.Plugin = { rules };

export const acalyleConfig: Linter.Config = {
  plugins: {
    acalyle: acalylePlugin,
  },
  rules: {
    "acalyle/prefer-string-literal": WARN,
  },
};
