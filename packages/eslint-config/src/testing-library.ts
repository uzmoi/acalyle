import type { Linter } from "eslint";
import eslintPluginTestingLibrary from "eslint-plugin-testing-library";

// cspell:word marko
export type TestingLibraryLib = "dom" | "angular" | "react" | "vue" | "marko";

export const testingLibrary = (lib: TestingLibraryLib): Linter.Config => ({
  files: ["**/*.test.*"],
  plugins: {
    "testing-library": eslintPluginTestingLibrary,
  },
  rules: {
    ...eslintPluginTestingLibrary.configs[`flat/${lib}`].rules,
  },
});
