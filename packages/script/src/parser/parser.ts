import * as P from "parsea";
import { error } from "parsea/internal";
import type { Delimiter, Keyword, Token, TokenType } from "./tokenizer";
import type { Expression } from "./types";

const token = <T extends TokenType, U extends string>(type: T, value?: U) =>
    P.satisfy<Token & { type: T; value: U }>(
        token =>
            (token as Token).type === type &&
            (!value || (token as Token).value === value),
        { error: error.expected(value ? `${type}("${value}")` : type) },
    );

const keyword = (word: Keyword) => token("Keyword", word);
const delimiter = (delimiter: Delimiter) => token("Delimiter", delimiter);
const punctuator = (punctuator: string) => token("Punctuator", punctuator);

export const expression: P.Parser<Expression> = /* #__PURE__ */ P.lazy(() =>
    P.choice([Ident, Bool, Tuple, If, Fn]).label("expression"),
);

const Ident = /* #__PURE__ */ token("Ident").map(token => {
    return {
        type: "Ident",
        name: token.value.replace(/\\(.)/gu, "$1"),
    } satisfies Expression;
});

const Bool = /* #__PURE__ */ P.choice([
    /* #__PURE__ */ keyword("true").return(true),
    /* #__PURE__ */ keyword("false").return(false),
]).map((value): Expression => ({ type: "Bool", value }));

const Tuple = /* #__PURE__ */ P.qo((perform): Expression => {
    perform(delimiter("("));
    const elements: Expression[] = [];
    perform.try(() => {
        for (;;) {
            const element = perform(expression);
            elements.push(element);
            perform(punctuator(","));
        }
    }, true);
    perform(delimiter(")"));
    return { type: "Tuple", elements };
});

const If = /* #__PURE__ */ P.qo((perform): Expression => {
    perform(keyword("if"));
    perform(delimiter("("));
    const cond = perform(expression);
    perform(delimiter(")"));
    const thenBody = perform(expression);
    const elseBody = perform.try(() => {
        perform(keyword("else"));
        return perform(expression);
    });
    return { type: "If", cond, thenBody, elseBody };
});

const Fn = /* #__PURE__ */ P.qo((perform): Expression => {
    perform(keyword("fn"));
    const params = perform.try(() => {
        perform(delimiter("("));
        const params = perform(Ident.apply(P.many));
        perform(delimiter(")"));
        return params;
    });
    const body = perform(expression);
    return {
        type: "Fn",
        params: params ?? [],
        body,
    };
});
