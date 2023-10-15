import { EOI } from "parsea";
import { describe, expect, test } from "vitest";
import { expression } from "./parser";
import { Tokenizer } from "./tokenizer";
import type { Expression, IdentExpression } from "./types";

const parseExpr = (source: string) => {
    const tokens = new Tokenizer(source)
        .tokenize()
        .filter(token => token.type !== "Whitespace");
    const result = expression.skip(EOI).parse(tokens);
    return result.success
        ? result.value
        : [result.errors, tokens[result.index]];
};

const ident = (name: string): IdentExpression => ({ type: "Ident", name });
const bool = (value: boolean): Expression => ({ type: "Bool", value });
const number = (value: string): Expression => ({ type: "Number", value });
const string = (strings: string[], values: Expression[] = []): Expression => ({
    type: "String",
    strings,
    values,
});
const tuple = (elements: Expression[] = []): Expression => ({
    type: "Tuple",
    elements,
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
            expect(parseExpr("fn () x")).toEqual(fn([], ident("x")));
        });
        test("identify", () => {
            expect(parseExpr("fn (x) x")).toEqual(fn([ident("x")], ident("x")));
        });
    });
});
