import * as P from "parsea";
import { error } from "parsea/internal";
import { type Loc, loc } from "./location";
import type { Delimiter, Keyword, Token, TokenType } from "./tokenizer";
import type * as types from "./types";

type Expression = types.Expression<Loc>;
type Statement = types.Statement<Loc>;

const token = <T extends TokenType, U extends string>(type: T, value?: U) =>
    P.satisfy<Token & { type: T; value: U }>(
        token =>
            (token as Token).type === type &&
            (!value || (token as Token).value === value),
        { error: error.expected(value ? `${type}("${value}")` : type) },
    );

const keyword = (word: Keyword) => token("Keyword", word);

const delimiter = (delimiter: Delimiter) => token("Delimiter", delimiter);
// parenthesis
const parenStart = /* #__PURE__ */ delimiter("(");
const parenEnd = /* #__PURE__ */ delimiter(")");
// square bracket
const _bracketStart = /* #__PURE__ */ delimiter("[");
const _bracketEnd = /* #__PURE__ */ delimiter("]");
// curly brace
const curlyBraceStart = /* #__PURE__ */ delimiter("{");
const curlyBraceEnd = /* #__PURE__ */ delimiter("}");
// other delimiter
const semicolon = /* #__PURE__ */ delimiter(";");
const comma = /* #__PURE__ */ delimiter(",");
const dot = /* #__PURE__ */ delimiter(".");

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
    const start = perform(parenStart);
    const elements: Expression[] = [];
    const properties: [types.IdentExpression<Loc>, Expression][] = [];
    perform.try(() => {
        for (;;) {
            // FIXME: "(ident = )"が通ってしまう
            const label = perform(Ident.skip(punctuator("=")).option());
            const element = perform(expression);
            if (label == null) {
                elements.push(element);
            } else {
                properties.push([label, element]);
            }
            perform(comma);
        }
    }, true);
    const end = perform(parenEnd);
    return { type: "Tuple", elements, properties, loc: loc(start, end) };
});

const Block = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(curlyBraceStart);
    const stmts = perform(statement.apply(P.many));
    const last = perform(expression.option(null));
    const end = perform(curlyBraceEnd);
    return { type: "Block", stmts, last, loc: loc(start, end) };
});

const If = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(keyword("if"));
    perform(parenStart);
    const cond = perform(expression);
    perform(parenEnd);
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

const Loop = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(keyword("loop"));
    const body = perform(expression);
    return {
        type: "Loop",
        body,
        loc: loc(start, body),
    };
});

const Break = /* #__PURE__ */ P.lazy(() =>
    keyword("break").andMap(
        expression.option(null),
        (start, body): Expression => ({
            type: "Break",
            body,
            loc: loc(start, body ?? start),
        }),
    ),
);

const Fn = /* #__PURE__ */ P.qo((perform): Expression => {
    const start = perform(keyword("fn"));
    const params = perform(
        Ident.apply(P.many).between(parenStart, parenEnd).option(),
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
    P.choice([
        Ident,
        Bool,
        Number,
        String,
        Tuple,
        Block,
        If,
        Loop,
        Break,
        Fn,
        Return,
    ])
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
    /* #__PURE__ */ dot
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
    return { type: "Let", dest, init, loc: loc(start, init) };
});

export const statement: P.Parser<Statement> = /* #__PURE__ */ P.choice([
    Let,
    /* #__PURE__ */ expression.skip(semicolon).map(
        (expr): Statement => ({
            type: "Expression",
            expr,
            loc: expr.loc,
        }),
    ),
])
    .skip(/* #__PURE__ */ semicolon.apply(P.many))
    .label("statement");
