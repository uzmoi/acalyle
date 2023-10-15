import { describe, expect, test } from "vitest";
import { expression } from "./parser";
import { Tokenizer } from "./tokenizer";
import type { Expression } from "./types";

const parseExpr = (source: string) => {
    const tokens = new Tokenizer(source).tokenize();
    const result = expression.parse(
        tokens.filter(token => token.type !== "Whitespace"),
    );
    return result.success ? result.value : result.errors;
};

const ident = (name: string): Expression => ({ type: "Ident", name });
const bool = (value: boolean): Expression => ({ type: "Bool", value });

describe("Expression", () => {
    test("Ident", () => {
        expect(parseExpr("hoge")).toEqual(ident("hoge"));
    });
    test("Bool", () => {
        expect(parseExpr("true")).toEqual(bool(true));
    });
});
