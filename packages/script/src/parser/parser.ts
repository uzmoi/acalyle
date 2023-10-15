import * as P from "parsea";
import type { Delimiter, Keyword, Token, TokenType } from "./tokenizer";
import type { Expression } from "./types";

const token = <T extends TokenType, U extends string>(type: T, value?: U) =>
    P.satisfy<Token & { type: T; value: U }>(
        token =>
            (token as Token).type === type &&
            (!value || (token as Token).value === value),
    );

const keyword = (word: Keyword) => token("Keyword", word);
const _delimiter = (delimiter: Delimiter) => token("Delimiter", delimiter);
const _punctuator = (punctuator: string) => token("Punctuator", punctuator);

export const expression: P.Parser<Expression> = /* #__PURE__ */ P.lazy(() =>
    P.choice([Ident, Bool]),
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
