import type { ESLint, Linter } from "eslint";
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";
import { tsExts, unPartial } from "./util";

// cspell:word marko
export type TestingLibraryLib = "dom" | "angular" | "react" | "vue" | "marko";

export const testingLibrary = (lib: TestingLibraryLib): Linter.FlatConfig => ({
  files: [`**/*.test.${tsExts}`],
  plugins: {
    "testing-library": eslintPluginTestingLibrary,
  },
  rules: {
    ...unPartial(
      (eslintPluginTestingLibrary.configs?.[lib] as ESLint.ConfigData).rules!,
    ),
  },
});
