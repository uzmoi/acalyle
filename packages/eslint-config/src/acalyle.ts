import type { ESLint, Linter } from "eslint";
import { rules } from "./rules";
import { WARN, tsExts } from "./util";

export const acalylePlugin: ESLint.Plugin = { rules };

export const acalyleConfig: Linter.Config = {
  files: [`**/*.${tsExts}`],
  plugins: {
    acalyle: acalylePlugin,
  },
  rules: {
    "acalyle/prefer-string-literal": WARN,
  },
};
