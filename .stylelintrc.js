/** @type {import("stylelint").Config} */
module.exports = {
    extends: [
        "stylelint-config-standard",
        "stylelint-config-recess-order",
    ],
    customSyntax: "@stylelint/postcss-css-in-js",
    // https://stylelint.io/user-guide/rules/list/
    rules: {
        "indentation": [4, { baseIndentLevel: 1 }],
        "selector-list-comma-newline-before": "never-multi-line",
        "selector-list-comma-newline-after": "always-multi-line",
        "selector-list-comma-space-before": "never",
        "selector-list-comma-space-after": "always-single-line",

        "rule-empty-line-before": ["always-multi-line", {
            except: ["inside-block"],
            ignore: ["after-comment"],
        }],
        "at-rule-empty-line-before": ["always", { except: ["inside-block"] }],
        "comment-empty-line-before": null,
        "custom-property-empty-line-before": "never",
        "declaration-empty-line-before": "never",
    },
    overrides: [
        {
            files: "**/*.(ts|tsx)",
            rules: {
                "no-empty-first-line": null,
                "rule-empty-line-before": "never",
                "at-rule-empty-line-before": "never",
                "comment-empty-line-before": "never",
            },
        },
    ],
};
