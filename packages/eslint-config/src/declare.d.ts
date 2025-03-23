declare module "eslint-plugin-react" {
  import type { Linter } from "eslint";

  const exports: {
    configs: {
      flat: {
        recommended: Linter.FlatConfig;
        "jsx-runtime": Linter.FlatConfig;
        all: Linter.FlatConfig;
      };
    };
  };
  export default exports;
}

declare module "eslint-plugin-react-hooks" {
  import type { ESLint } from "eslint";

  const exports: ESLint.Plugin;
  export default exports;
}

declare module "eslint-plugin-import" {
  import type { Linter } from "eslint";

  const exports: {
    flatConfigs: {
      recommended: Linter.FlatConfig;
      errors: Linter.FlatConfig;
      warnings: Linter.FlatConfig;
      react: Linter.FlatConfig;
      "react-native": Linter.FlatConfig;
      electron: Linter.FlatConfig;
      typescript: Linter.FlatConfig;
    };
  };
  export default exports;
}

declare module "eslint-plugin-testing-library" {
  import type { ESLint } from "eslint";

  const exports: ESLint.Plugin;
  export default exports;
}
