import { assert } from "emnorst";
import type { Rule, SourceCode } from "eslint";
import esquery from "esquery";
import type * as ESTree from "estree";
import { RuleOptions, jsonSchema, memoize } from "../util";

// https://github.com/rollup/rollup/pull/5024
const _isPureFunctionComment = (comment: ESTree.Comment): boolean =>
    /[#@]__NO_SIDE_EFFECTS__/.test(comment.value);

const isPureComment = (comment: ESTree.Comment): boolean =>
    /[#@]__PURE__/.test(comment.value);

const parsePattern = memoize((filter: string) => {
    const ancestryAttributes: string[] = [];
    let selector = "";
    const xs = filter.split(".").reverse();
    for (const [i, name] of xs.entries()) {
        const ancestryAttribute = [
            ...ancestryAttributes,
            i === xs.length - 1 ?
                name === "*" ?
                    "type"
                :   "name"
            :   "property.name",
        ].join(".");
        const nameRe = name.replace(/\*/g, ".+");
        selector += `[${ancestryAttribute}=/^${nameRe}$/]`;
        const isMetaProperty =
            filter.startsWith("import.") && i === xs.length - 2;
        ancestryAttributes.push(isMetaProperty ? "meta" : "object");
    }

    return esquery.parse(selector);
});

// TODO: Support __NO_SIDE_EFFECTS__.
const isPureFunction = (
    node: ESTree.Expression,
    pureFunctions: readonly string[] = [],
): boolean => {
    if (
        pureFunctions.some(pattern =>
            esquery.matches(node, parsePattern(pattern)),
        )
    ) {
        return true;
    }

    // isPureFunctionComment
    return false;
};

const checkNodeType = [
    "AwaitExpression",
    "UpdateExpression",
    "AssignmentExpression",
    "UnaryExpression",
    "ThrowStatement",
    "NewExpression",
    "TaggedTemplateExpression",
    "CallExpression",
] as const;

const pureCommentSupportNodeType = new Set<Rule.Node["type"]>([
    "NewExpression",
    "TaggedTemplateExpression",
    "CallExpression",
]);

type CheckNode = Extract<Rule.Node, { type: (typeof checkNodeType)[number] }>;

const isPureNode = (
    node: CheckNode,
    source: SourceCode,
    options: RuleOptions<typeof schema>,
): boolean => {
    switch (node.type) {
        case "AwaitExpression": {
            return !!options.allowAwait;
        }
        case "UpdateExpression":
        case "AssignmentExpression": {
            return !!options.allowAssign;
        }
        case "UnaryExpression": {
            return !!options.allowDelete || node.operator !== "delete";
        }
        case "ThrowStatement": {
            return !!options.allowThrow;
        }
        case "NewExpression": {
            return (
                !!options.allowNew ||
                source.getCommentsBefore(node).some(isPureComment)
            );
        }
        case "TaggedTemplateExpression": {
            return (
                !!(options.allowTaggedTemplate ?? options.allowCall) ||
                source.getCommentsBefore(node).some(isPureComment) ||
                isPureFunction(node.tag, options.pureFunctions)
            );
        }
        case "CallExpression": {
            return (
                !!options.allowCall ||
                source.getCommentsBefore(node).some(isPureComment) ||
                node.callee.type === "Super" ||
                isPureFunction(node.callee, options.pureFunctions)
            );
        }
        default: {
            assert.unreachable<typeof node>();
        }
    }
};

const functionNodeType = new Set<Rule.Node["type"]>([
    "MethodDefinition",
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
]);

const isInFunction = (
    ancestors: readonly ESTree.Node[],
    options: RuleOptions<typeof schema>,
): boolean => {
    return ancestors.some(node => {
        return (
            functionNodeType.has(node.type) ||
            (node.type === "PropertyDefinition" && !node.static) ||
            (options.allowInStaticBlock && node.type === "StaticBlock")
        );
    });
};

const schema = jsonSchema.object({
    pureFunctions: jsonSchema.array(
        jsonSchema.string({
            pattern: "^(\\*|[$\\w]+)(\\.(\\*|[$\\w]+))*$",
        }),
    ),
    allowCall: jsonSchema.boolean(),
    allowTaggedTemplate: jsonSchema.boolean(),
    allowNew: jsonSchema.boolean(),
    allowAssign: jsonSchema.boolean(),
    allowDelete: jsonSchema.boolean(),
    allowThrow: jsonSchema.boolean(),
    allowAwait: jsonSchema.boolean(),
    allowInStaticBlock: jsonSchema.boolean(),
});

export const noModuleSideEffect: Rule.RuleModule = {
    meta: {
        type: "problem",
        docs: {
            description:
                "Disallow side effects at the top level of the module.",
        },
        hasSuggestions: true,
        schema: [schema],
    },
    create(context) {
        const options: RuleOptions<typeof schema> = {
            allowNew: true,
            allowInStaticBlock: true,
            ...(context.options[0] as RuleOptions<typeof schema>),
        };

        const checkSideEffect = (node: CheckNode) => {
            if (isPureNode(node, context.sourceCode, options)) return;
            if (isInFunction(context.sourceCode.getAncestors(node), options))
                return;

            const suggestions: Rule.SuggestionReportDescriptor[] = [];
            if (pureCommentSupportNodeType.has(node.type)) {
                suggestions.push({
                    desc: "Insert __PURE__ comment",
                    fix(fixer) {
                        return fixer.insertTextBefore(node, "/* #__PURE__ */ ");
                    },
                });
            }

            context.report({
                node,
                message: "Toplevel side effect.",
                suggest: suggestions,
            });
        };

        const listener: Rule.RuleListener = {};

        for (const type of checkNodeType) {
            listener[type] = checkSideEffect;
        }

        return listener;
    },
};
