import { ESLint, Linter } from "eslint";
import perfectionist from "eslint-plugin-perfectionist";
import { OFF, replaceWarn } from "./util";

export const perfectionistConfig: Linter.FlatConfig = {
    plugins: { perfectionist },
    rules: {
        ...replaceWarn(
            (
                perfectionist.configs?.[
                    "recommended-natural"
                ] as ESLint.ConfigData
            ).rules!,
        ),
        "perfectionist/sort-imports": OFF,
        "perfectionist/sort-interfaces": OFF,
        "perfectionist/sort-classes": OFF,
        "perfectionist/sort-jsx-props": OFF,
        "perfectionist/sort-object-types": OFF,
        "perfectionist/sort-objects": OFF,
        "perfectionist/sort-union-types": OFF,
    },
};
