import { EOI } from "parsea";
import { describe, expect, test } from "vitest";
import { Tokenizer, expression } from "../parser";
import { evaluateExpression } from "./evaluate";
import { Scope } from "./scope";
import {
    BoolValue,
    FnValue,
    IntValue,
    StringValue,
    TupleValue,
} from "./value/builtin";
import type { Value } from "./value/types";

const run = (source: string) => {
    const tokens = new Tokenizer(source)
        .tokenize()
        .filter(token => token.type !== "Whitespace");
    const result = expression.skip(EOI).parse(tokens);
    const scope = Scope.create<Value>();
    return result.success
        ? evaluateExpression(result.value, scope)
        : ([result.errors, tokens[result.index]] as const);
};

describe("Expression", () => {
    test("bool", () => {
        expect(run("true")).toStrictEqual(new BoolValue(true));
    });
    test("number", () => {
        expect(run("1")).toStrictEqual(new IntValue(1));
    });
    test("string", () => {
        expect(run('"hoge"')).toStrictEqual(new StringValue("hoge"));
    });
    test("tuple", () => {
        expect(run("(1)")).toStrictEqual(new TupleValue([new IntValue(1)], {}));
    });
    describe("block", () => {
        test("block", () => {
            expect(run("{ 1 }")).toStrictEqual(new IntValue(1));
        });
        test("empty", () => {
            expect(run("{}")).toBeUndefined();
        });
    });
    test("if", () => {
        expect(run("if (true) 1 else 0")).toStrictEqual(new IntValue(1));
    });
    describe("fn", () => {
        test("fn", () => {
            expect(run("fn {}")).toBeInstanceOf(FnValue);
        });
        test("return in outside of function", () => {
            expect(() => run("return")).toThrow();
        });
        test("apply non function", () => {
            expect(() => run("0()")).toThrow(TypeError);
        });
        test("apply function", () => {
            expect(run("{ fn {} }()")).toBeUndefined();
        });
    });
    test("property", () => {
        expect(run("(hoge = 1).hoge")).toStrictEqual(new IntValue(1));
    });
    test.todo("operator");
});
