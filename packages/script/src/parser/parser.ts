import * as P from "parsea";
import { error } from "parsea/internal";
import { loc } from "./location";
import type { Delimiter, Keyword, Token, TokenType } from "./tokenizer";
import type { Expression, IdentExpression, Statement } from "./types";

const token = <T extends TokenType, U extends string>(type: T, value?: U) =>
    P.satisfy<Token & { type: T; value: U }>(
        token =>
            (token as Token).type === type &&
            (!value || (token as Token).value === value),
        { error: error.expected(value ? `${type}("${value}")` : type) },
    );

const keyword = (word: Keyword) => token("Keyword", word);
const delimiter = (delimiter: Delimiter) => token("Delimiter", delimiter);
const punctuator = <T extends string>(punctuator?: T) =>
    token("Punctuator", punctuator);

const Ident = /* #__PURE__ */ token("Ident").map(token => {
    return {
        type: "Ident",
        name: token.value.replace(/\\(.)/gu, "$1"),
        loc: token.loc,
    } satisfies Expression;
});

const Bool = /* #__PURE__ */ P.choice([
    /* #__PURE__ */ keyword("true"),
    /* #__PURE__ */ keyword("false"),
]).map(
    (token): Expression => ({
        type: "Bool",
        value: token.value === "true",
        loc: token.loc,
    }),
);

const Number = /* #__PURE__ */ P.qo((perform): Expression => {
    const sign =
        perform(punctuator("+").option()) ?? perform(punctuator("-").option());
    const number = perform(token("Number"));
    return {
        type: "Number",
        value: `${sign?.value ?? ""}${number.value}`,
        loc: loc(sign ?? number, number),
    };
});

const String = /* #__PURE__ */ P.qo((perform): Expression => {
    const stringToken = token("String");
    const first = perform(stringToken);
    /* c8 ignore next 3 */
    if (!first.value.startsWith('"')) {
        perform(P.fail());
    }
    const strings: string[] = [first.value.replace(/^"|["$]$/g, "")];
    const values: Expression[] = [];
    let last = first;
    while (last.value.endsWith("$")) {
        values.push(perform(Ident));
        last = perform(stringToken);
        strings.push(last.value.replace(/["$]$/, ""));
    }
    return { type: "String", strings, values, loc: loc(first, last) };
});

const Tuple = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(delimiter("("));
    const elements: Expression[] = [];
    const properties: [IdentExpression, Expression][] = [];
    perform.try(() => {
        for (;;) {
            const label = perform(Ident.skip(punctuator("=")).option());
            const element = perform(expression);
            if (label == null) {
                elements.push(element);
            } else {
                properties.push([label, element]);
            }
            perform(delimiter(","));
        }
    }, true);
    const end = perform(delimiter(")"));
    return { type: "Tuple", elements, properties, loc: loc(start, end) };
});

const Block = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(delimiter("{"));
    const stmts = perform(statement.apply(P.many));
    const last = perform(expression.option(null));
    const end = perform(delimiter("}"));
    return { type: "Block", stmts, last, loc: loc(start, end) };
});

const If = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(keyword("if"));
    perform(delimiter("("));
    const cond = perform(expression);
    perform(delimiter(")"));
    const thenBody = perform(expression);
    const elseBody = perform(keyword("else").then(expression).option(null));
    return {
        type: "If",
        cond,
        thenBody,
        elseBody,
        loc: loc(start, elseBody ?? thenBody),
    };
});

const Fn = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(keyword("fn"));
    const params = perform(
        Ident.apply(P.many).between(delimiter("("), delimiter(")")).option(),
    );
    const body = perform(expression);
    return {
        type: "Fn",
        params: params ?? [],
        body,
        loc: loc(start, body),
    };
});

const Return = /* #__PURE__ */ P.lazy(() =>
    keyword("return").andMap(
        expression.option(null),
        (start, body): Expression => ({
            type: "Return",
            body,
            loc: loc(start, body ?? start),
        }),
    ),
);

export const expression: P.Parser<Expression> =
    /* #__PURE__ */
    P.choice([Ident, Bool, Number, String, Tuple, Block, If, Fn, Return])
        .flatMap(expr => {
            return ExpressionTail.map(expressionTails => {
                return expressionTails.reduce((lhs, rhs) => rhs(lhs), expr);
            });
        })
        .label("expression");

const ExpressionTail = /* #__PURE__ */ P.choice([
    /* #__PURE__ */ Tuple.map(
        tuple =>
            (callee: Expression): Expression => ({
                type: "Apply",
                callee,
                args: (tuple as typeof tuple & { type: "Tuple" }).elements,
                loc: loc(callee, tuple),
            }),
    ),
    /* #__PURE__ */ delimiter(".")
        // eslint-disable-next-line unicorn/prefer-top-level-await
        .then(Ident)
        .map(
            ident =>
                (target: Expression): Expression => ({
                    type: "Property",
                    target,
                    property: ident,
                    loc: loc(target, ident),
                }),
        ),
    /* #__PURE__ */ punctuator().andMap(
        expression,
        (op, rhs) =>
            (lhs: Expression): Expression => ({
                type: "Operator",
                op: op.value,
                lhs,
                rhs,
                loc: loc(lhs, rhs),
            }),
    ),
]).apply(P.many);

const Let = /* #__PURE__ */ P.qo((perform): Statement => {
    const start = perform(keyword("let"));
    const dest = perform(Ident);
    perform(punctuator("="));
    const init = perform(expression);
    const end = perform(delimiter(";"));
    return { type: "Let", dest, init, loc: loc(start, end) };
});

export const statement: P.Parser<Statement> = /* #__PURE__ */ P.choice([
    Let,
    /* #__PURE__ */ expression.andMap(
        /* #__PURE__ */ delimiter(";"),
        (expr, end): Statement => ({
            type: "Expression",
            expr,
            loc: loc(expr, end),
        }),
    ),
]).label("statement");
