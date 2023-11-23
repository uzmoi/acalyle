import type { Rule } from "eslint";

export const preferStringLiteral: Rule.RuleModule = {
    meta: {
        type: "suggestion",
        fixable: "code",
        schema: [],
    },
    create(context) {
        return {
            ["TemplateLiteral"](node) {
                if (node.parent.type === "TaggedTemplateExpression") return;
                const element = node.quasis[0];
                if (!element?.tail) return;
                const raw = element.value.raw;
                if (raw.includes("\n")) return;
                context.report({
                    node,
                    message: "Prefer string literal.",
                    fix(fixer) {
                        const contents = raw
                            .replace(/"/g, '\\"')
                            .replace(/\\`/, "`");
                        return fixer.replaceText(node, `"${contents}"`);
                    },
                });
            },
        };
    },
};
