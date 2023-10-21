import { EOI, type Parser } from "parsea";
import { describe, expect, test } from "vitest";
import { Tokenizer, expression, statement } from "../parser";
import { evaluateExpression, evaluateStatement } from "./evaluate";
import { Scope } from "./scope";
import {
    BoolValue,
    FnValue,
    IntValue,
    StringValue,
    TupleValue,
} from "./value/builtin";
import type { Value } from "./value/types";

const getIteratorReturn = <R>(iterator: Iterator<unknown, R>): R => {
    let result: IteratorResult<unknown, R>;
    while (!(result = iterator.next()).done);
    return result.value;
};

const run = <T, U>(
    source: string,
    parser: Parser<T>,
    evaluate: (value: T, scope: Scope<Value>) => Iterator<unknown, U>,
    scope = Scope.create<Value>(),
) => {
    const tokens = new Tokenizer(source)
        .tokenize()
        .filter(token => token.type !== "Whitespace");
    const result = parser.skip(EOI).parse(tokens);
    if (result.success) {
        const steps = evaluate(result.value, scope);
        return getIteratorReturn(steps);
    } else {
        return [result.errors, tokens[result.index]] as const;
    }
};

const runExpr = (source: string) => {
    return run(source, expression, evaluateExpression);
};

const runStmt = (source: string, scope?: Scope<Value>) => {
    return run(source, statement, evaluateStatement, scope);
};

describe("Expression", () => {
    test("bool", () => {
        expect(runExpr("true")).toStrictEqual(new BoolValue(true));
    });
    test("number", () => {
        expect(runExpr("1")).toStrictEqual(new IntValue(1));
    });
    test("string", () => {
        expect(runExpr('"hoge"')).toStrictEqual(new StringValue("hoge"));
    });
    test("tuple", () => {
        expect(runExpr("(1)")).toStrictEqual(
            new TupleValue([new IntValue(1)], {}),
        );
    });
    describe("block", () => {
        test("block", () => {
            expect(runExpr("{ 1 }")).toStrictEqual(new IntValue(1));
        });
        test("empty", () => {
            expect(runExpr("{}")).toBeUndefined();
        });
    });
    test("if", () => {
        expect(runExpr("if (true) 1 else 0")).toStrictEqual(new IntValue(1));
    });
    describe("fn", () => {
        test("fn", () => {
            expect(runExpr("fn {}")).toBeInstanceOf(FnValue);
        });
        test("return in outside of function", () => {
            expect(() => runExpr("return")).toThrow();
        });
        test("apply non function", () => {
            expect(() => runExpr("0()")).toThrow(TypeError);
        });
        test("apply function", () => {
            expect(runExpr("{ fn {} }()")).toBeUndefined();
        });
    });
    test("property", () => {
        expect(runExpr("(hoge = 1).hoge")).toStrictEqual(new IntValue(1));
    });
    test.todo("operator");
});

describe("Statement", () => {
    test("let", () => {
        const scope = Scope.create<Value>();
        runStmt("let hoge = 0;", scope);
        expect(scope.get("hoge").getUnion()).toStrictEqual(new IntValue(0));
    });
});
