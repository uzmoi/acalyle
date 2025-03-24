import type { Linter } from "eslint";
import tsEslint from "typescript-eslint";
import { OFF, replaceWarn, warn } from "./util";

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
      // (recommendedTypeChecked | stylisticTypeChecked) & oxlint
      "@typescript-eslint/adjacent-overload-signatures": OFF,
      "@typescript-eslint/array-type": OFF,
      "@typescript-eslint/ban-ts-comment": OFF,
      "@typescript-eslint/consistent-generic-constructors": OFF,
      "@typescript-eslint/consistent-indexed-object-style": OFF,
      "@typescript-eslint/consistent-type-definitions": OFF,
      "@typescript-eslint/no-array-constructor": OFF,
      "@typescript-eslint/no-confusing-non-null-assertion": OFF,
      "@typescript-eslint/no-duplicate-enum-values": OFF,
      // oxlintがコンストラクタ引数部分でプロパティー宣言しても警告してくるのでこっちを使う。
      // "@typescript-eslint/no-empty-function": OFF,
      "@typescript-eslint/no-empty-object-type": OFF,
      "@typescript-eslint/no-explicit-any": OFF,
      "@typescript-eslint/no-extra-non-null-assertion": OFF,
      "@typescript-eslint/no-inferrable-types": OFF,
      "@typescript-eslint/no-misused-new": OFF,
      "@typescript-eslint/no-namespace": OFF,
      "@typescript-eslint/no-non-null-asserted-optional-chain": OFF,
      "@typescript-eslint/no-require-imports": OFF,
      "@typescript-eslint/no-this-alias": OFF,
      "@typescript-eslint/no-unnecessary-type-constraint": OFF,
      "@typescript-eslint/no-unsafe-declaration-merging": OFF,
      "@typescript-eslint/no-unsafe-function-type": OFF,
      "@typescript-eslint/no-unused-expressions": OFF,
      "@typescript-eslint/no-unused-vars": OFF,
      "@typescript-eslint/no-wrapper-object-types": OFF,
      "@typescript-eslint/prefer-as-const": OFF,
      "@typescript-eslint/prefer-for-of": OFF,
      "@typescript-eslint/prefer-function-type": OFF,
      "@typescript-eslint/prefer-namespace-keyword": OFF,
      "@typescript-eslint/prefer-promise-reject-errors": OFF,
      "@typescript-eslint/require-await": OFF,
      "@typescript-eslint/triple-slash-reference": OFF,

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
