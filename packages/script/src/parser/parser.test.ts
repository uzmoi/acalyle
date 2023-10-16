import { EOI, Parser } from "parsea";
import { describe, expect, test } from "vitest";
import { expression, statement } from "./parser";
import { Tokenizer } from "./tokenizer";
import type { Expression, IdentExpression, Statement } from "./types";

const parse = <T>(parser: Parser<T>, source: string) => {
    const tokens = new Tokenizer(source)
        .tokenize()
        .filter(token => token.type !== "Whitespace");
    const result = parser.skip(EOI).parse(tokens);
    return result.success
        ? result.value
        : [result.errors, tokens[result.index]];
};

const parseExpr = (source: string) => {
    return parse(expression, source);
};

const parseStmt = (source: string) => {
    return parse(statement, source);
};

const ident = (name: string): IdentExpression => ({ type: "Ident", name });
const bool = (value: boolean): Expression => ({ type: "Bool", value });
const number = (value: string): Expression => ({ type: "Number", value });
const string = (strings: string[], values: Expression[] = []): Expression => ({
    type: "String",
    strings,
    values,
});
const tuple = (
    elements: Expression[] = [],
    properties: [IdentExpression, Expression][] = [],
): Expression => ({
    type: "Tuple",
    elements,
    properties,
});
const block = (
    stmts: Statement[] = [],
    last: Expression | null = null,
): Expression => ({
    type: "Block",
    stmts,
    last,
});
const $if = (
    cond: Expression,
    thenBody: Expression,
    elseBody: Expression | null = null,
): Expression => ({ type: "If", cond, thenBody, elseBody });
const fn = (params: IdentExpression[], body: Expression): Expression => ({
    type: "Fn",
    params,
    body,
});
const ret = (body: Expression | null = null): Expression => ({
    type: "Return",
    body,
});

describe("Expression", () => {
    test("Ident", () => {
        expect(parseExpr("hoge")).toEqual(ident("hoge"));
    });
    describe("Bool", () => {
        test("true", () => {
            expect(parseExpr("true")).toEqual(bool(true));
        });
        test("false", () => {
            expect(parseExpr("false")).toEqual(bool(false));
        });
    });
    describe("Number", () => {
        test("number", () => {
            expect(parseExpr("0")).toEqual(number("0"));
        });
        test("plus", () => {
            expect(parseExpr("+1")).toEqual(number("+1"));
        });
        test("minus", () => {
            expect(parseExpr("-1")).toEqual(number("-1"));
        });
    });
    describe("String", () => {
        test("string", () => {
            expect(parseExpr('"hoge"')).toEqual(string(["hoge"]));
        });
        test("$ident", () => {
            expect(parseExpr('"Hello $name!"')).toEqual(
                string(["Hello ", "!"], [ident("name")]),
            );
        });
    });
    describe("Tuple", () => {
        test("empty", () => {
            expect(parseExpr("()")).toEqual(tuple());
        });
        test("(expr)", () => {
            expect(parseExpr("(true)")).toEqual(tuple([bool(true)]));
        });
        test("allow trailing comma", () => {
            expect(parseExpr("(true, )")).toEqual(tuple([bool(true)]));
        });
        test("named property", () => {
            expect(parseExpr("(hoge = false)")).toEqual(
                tuple([], [[ident("hoge"), bool(false)]]),
            );
        });
    });
    describe("Block", () => {
        test("empty", () => {
            expect(parseExpr("{}")).toEqual(block());
        });
        test("{ expr }", () => {
            expect(parseExpr("{ () }")).toEqual(block([], tuple()));
        });
        test("{ stmt; }", () => {
            expect(parseExpr("{ hoge; () }")).toEqual(
                block([expr(ident("hoge"))], tuple()),
            );
        });
    });
    describe("If", () => {
        test("if-then-else", () => {
            expect(parseExpr("if (cond) true else false")).toEqual(
                $if(ident("cond"), bool(true), bool(false)),
            );
        });
        test("if-then", () => {
            expect(parseExpr("if (cond) true")).toEqual(
                $if(ident("cond"), bool(true)),
            );
        });
    });
    describe("Fn", () => {
        test("return true", () => {
            expect(parseExpr("fn true")).toEqual(fn([], bool(true)));
        });
        test("empty params", () => {
            expect(parseExpr("fn () {}")).toEqual(fn([], block()));
        });
        test("identify", () => {
            expect(parseExpr("fn (x) x")).toEqual(fn([ident("x")], ident("x")));
        });
    });
    describe("Return", () => {
        test("return", () => {
            expect(parseExpr("return")).toEqual(ret());
        });
        test("return with value", () => {
            expect(parseExpr("return result")).toEqual(ret(ident("result")));
        });
    });
});

const expr = (expr: Expression): Statement => ({ type: "Expression", expr });

describe("Statement", () => {
    test("Expression", () => {
        expect(parseStmt("hoge;")).toEqual(expr(ident("hoge")));
    });
});
