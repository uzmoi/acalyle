import { assert } from "emnorst";
import type { Expression, Statement } from "../parser";
import type { Scope } from "./scope";
import { assertInstance } from "./util";
import {
    BoolValue,
    FnValue,
    IntValue,
    StringValue,
    TupleValue,
} from "./value/builtin";
import type { Value } from "./value/types";

export const evaluateExpression = (
    expr: Expression,
    scope: Scope<Value>,
): Value | undefined => {
    switch (expr.type) {
        case "Ident": {
            return scope.get(expr.name).getOrThrow();
        }
        case "Bool": {
            return new BoolValue(expr.value);
        }
        case "Number": {
            const value = Number.parseInt(expr.value, 10);
            return new IntValue(value);
        }
        case "String": {
            let string = "";
            string += expr.strings[0]!;
            for (let i = 0; i < expr.values.length; i++) {
                const node = evaluateExpression(expr.values[i]!, scope);
                assert.nonNullable(node);
                assertInstance(node, StringValue);
                string += node.value;
                string += expr.strings[i + 1]!;
            }
            return new StringValue(string);
        }
        case "Tuple": {
            const elements: Value[] = [];
            for (const element of expr.elements) {
                const value = evaluateExpression(element, scope);
                assert.nonNullable(value);
                elements.push(value);
            }
            const properties: Record<string, Value> = {};
            for (const [key, property] of expr.properties) {
                const value = evaluateExpression(property, scope);
                assert.nonNullable(value);
                properties[key.name] = value;
            }
            return new TupleValue(elements, properties);
        }
        case "Block": {
            const blockScope = scope.child();
            for (const stmt of expr.stmts) {
                evaluateStatement(stmt, blockScope);
            }
            if (expr.last == null) return;
            return evaluateExpression(expr.last, blockScope);
        }
        case "If": {
            const cond = evaluateExpression(expr.cond, scope);
            assert.nonNullable(cond);
            assertInstance(cond, BoolValue);
            return cond.value
                ? evaluateExpression(expr.thenBody, scope)
                : evaluateExpression(expr.elseBody!, scope);
        }
        case "Fn": {
            return new FnValue(expr.params, expr.body, scope);
        }
        case "Return": {
            if (expr.body != null) {
                const value = evaluateExpression(expr.body, scope);
                throw { type: "return", value };
            }
            throw { type: "return" };
        }
        case "Apply": {
            const fn = evaluateExpression(expr.callee, scope);
            assert.nonNullable(fn);
            assertInstance(fn, FnValue);
            const args: Value[] = [];
            for (const arg of expr.args) {
                const value = evaluateExpression(arg, scope);
                assert.nonNullable(value);
                args.push(value);
            }
            const fnScope = fn.initFnScope(args);
            try {
                return evaluateExpression(fn.body, fnScope);
            } catch (error) {
                if (
                    (error as { type: "return"; value?: Value })?.type ===
                    "return"
                ) {
                    return (error as { type: "return"; value?: Value }).value;
                }
                throw error;
            }
        }
        case "Property": {
            const target = evaluateExpression(expr.target, scope);
            assert.nonNullable(target);
            assertInstance(target, TupleValue);
            return target.get(expr.property.name);
        }
        case "Operator": {
            const lhs = evaluateExpression(expr.lhs, scope);
            assert.nonNullable(lhs);
            const rhs = evaluateExpression(expr.rhs, scope);
            assert.nonNullable(rhs);
            // expr.op
            // TODO: implementation
            throw new Error("not implemented");
        }
        default:
            assert.unreachable<typeof expr>();
    }
};

export const evaluateStatement = (
    stmt: Statement,
    scope: Scope<Value>,
): void => {
    switch (stmt.type) {
        case "Expression": {
            evaluateExpression(stmt.expr, scope);
            break;
        }
        default:
            // @ts-expect-error unionじゃないとswitch文のdefault:ではneverにならないらしい
            assert.unreachable<typeof stmt>();
    }
};
