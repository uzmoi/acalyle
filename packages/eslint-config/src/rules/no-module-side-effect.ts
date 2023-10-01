import { assert } from "emnorst";
import type { Rule, SourceCode } from "eslint";
import type * as ESTree from "estree"; // cspell:word estree
import type { JSONSchema4 } from "json-schema";

// TODO: Support __NO_SIDE_EFFECTS__.
// https://github.com/rollup/rollup/pull/5024
const _isPureFunctionComment = (comment: ESTree.Comment): boolean =>
    /[@#]__NO_SIDE_EFFECTS__/.test(comment.value);

const isPureComment = (comment: ESTree.Comment): boolean =>
    /[@#]__PURE__/.test(comment.value);

const isPureFunction = (
    node: ESTree.Expression,
    pureFunctions: readonly string[] = [],
): boolean => {
    // isPureFunctionComment

    // TODO: Identifier以外でもpureFunctionsにマッチさせる。
    if (node.type === "Identifier" && pureFunctions.includes(node.name)) {
        return true;
    }
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
    options: RuleOptions,
): boolean => {
    switch (node.type) {
        case "AwaitExpression":
            return !!options.allowAwait;
        case "UpdateExpression":
        case "AssignmentExpression":
            return !!options.allowAssign;
        case "UnaryExpression":
            return !!options.allowDelete || node.operator !== "delete";
        case "ThrowStatement":
            return !!options.allowThrow;
        case "NewExpression":
            return (
                options.allowNew ||
                source.getCommentsBefore(node).some(isPureComment)
            );
        case "TaggedTemplateExpression":
            return (
                (options.allowTaggedTemplate ?? options.allowCall) ||
                source.getCommentsBefore(node).some(isPureComment) ||
                isPureFunction(node.tag, options.pureFunctions)
            );
        case "CallExpression":
            return (
                options.allowCall ||
                source.getCommentsBefore(node).some(isPureComment) ||
                node.callee.type === "Super" ||
                isPureFunction(node.callee, options.pureFunctions)
            );
        default:
            assert.unreachable<typeof node>();
    }
};

const functionNodeType = new Set<Rule.Node["type"]>([
    "MethodDefinition",
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
]);

const isInFunction = (ancestors: readonly ESTree.Node[]): boolean => {
    return ancestors.some(node => {
        return (
            functionNodeType.has(node.type) ||
            (node.type === "PropertyDefinition" && !node.static)
        );
    });
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JSONSchema<out _ = unknown> extends JSONSchema4 {}

const jsonSchema = {
    object: <T>(properties: {
        [P in keyof T]: JSONSchema<T[P]>;
    }): JSONSchema<T> => ({ type: "object", properties }),
    array: <T>(items: JSONSchema<T>): JSONSchema<T[]> => ({
        type: "array",
        items,
    }),
    boolean: (): JSONSchema<boolean> => ({ type: "boolean" }),
    string: (): JSONSchema<string> => ({ type: "string" }),
};

type RuleOptions = Partial<
    typeof schema extends JSONSchema<infer T> ? T : never
>;
const schema = jsonSchema.object({
    pureFunctions: jsonSchema.array(jsonSchema.string()),
    allowCall: jsonSchema.boolean(),
    allowTaggedTemplate: jsonSchema.boolean(),
    allowNew: jsonSchema.boolean(),
    allowAssign: jsonSchema.boolean(),
    allowDelete: jsonSchema.boolean(),
    allowThrow: jsonSchema.boolean(),
    allowAwait: jsonSchema.boolean(),
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
        const options: RuleOptions = {
            allowNew: true,
            ...(context.options[0] as RuleOptions),
        };

        const checkSideEffect = (node: CheckNode) => {
            if (isPureNode(node, context.getSourceCode(), options)) return;
            if (isInFunction(context.getAncestors())) return;

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
