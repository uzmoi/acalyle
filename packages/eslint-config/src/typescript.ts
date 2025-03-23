import type { Linter } from "eslint";
import tsEslint from "typescript-eslint";
import { OFF, WARN, replaceWarn, warn } from "./util";

const stylisticTypeChecked = (
  tsEslint.configs.stylisticTypeChecked as Linter.Config[]
).at(-1)!;

export const typescript: Linter.Config[] = [
  ...(tsEslint.configs.recommendedTypeChecked as Linter.Config[]),
  {
    ...stylisticTypeChecked,
    rules: replaceWarn(stylisticTypeChecked.rules!),
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": OFF,
      "@typescript-eslint/no-restricted-types": WARN,
      "@typescript-eslint/no-unsafe-function-type": WARN,
      "@typescript-eslint/no-wrapper-object-types": WARN,
      "@typescript-eslint/no-namespace": warn({
        allowDeclarations: true,
        allowDefinitionFiles: true,
      }),
      "@typescript-eslint/no-unused-vars": warn({
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
      }),
      "@typescript-eslint/naming-convention": warn(
        { selector: "default", format: ["camelCase"] },
        {
          selector: "variableLike",
          modifiers: ["unused"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        ...[false, true].map(unused => ({
          selector: "variable",
          modifiers: ["const", unused && "unused"].filter(Boolean),
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: unused ? "allow" : undefined,
        })),
        ...[false, true].map(unused => ({
          // NOTE: selectorは配列でなくとも良いはずだが、
          // typescript-eslintのスキーマが非対応なのかエラーが出る
          selector: ["import"],
          modifiers: unused ? ["unused"] : undefined,
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: unused ? "allow" : undefined,
        })),
        {
          selector: ["objectLiteralProperty", "typeProperty"],
          format: ["camelCase", "PascalCase"],
          leadingUnderscore: "allowDouble",
        },
        {
          selector: ["objectLiteralProperty", "typeProperty"],
          modifiers: ["requiresQuotes"],
          format: null,
        },
        ...["private", "protected"].map(modifier => ({
          selector: "memberLike",
          modifiers: [modifier],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        })),
        {
          selector: "memberLike",
          modifiers: ["private"],
          filter: /.{3}/.source,
          format: ["camelCase"],
          leadingUnderscore: "require",
        },
        ...[false, true].map(unused => ({
          selector: "typeLike",
          modifiers: unused ? ["unused"] : undefined,
          format: ["PascalCase"],
          leadingUnderscore: unused ? "allow" : undefined,
        })),
      ),
    },
  },
];
