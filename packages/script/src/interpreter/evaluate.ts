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

export function* evaluateExpression(
    expr: Expression,
    scope: Scope<Value>,
): Generator<void, Value | undefined> {
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
                const node: Value | undefined = yield* evaluateExpression(
                    expr.values[i]!,
                    scope,
                );
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
                const value = yield* evaluateExpression(element, scope);
                assert.nonNullable(value);
                elements.push(value);
            }
            const properties: Record<string, Value> = {};
            for (const [key, property] of expr.properties) {
                const value = yield* evaluateExpression(property, scope);
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
            return yield* evaluateExpression(expr.last, blockScope);
        }
        case "If": {
            const cond = yield* evaluateExpression(expr.cond, scope);
            assert.nonNullable(cond);
            assertInstance(cond, BoolValue);
            return yield* cond.value
                ? evaluateExpression(expr.thenBody, scope)
                : evaluateExpression(expr.elseBody!, scope);
        }
        case "Fn": {
            return new FnValue(expr.params, expr.body, scope);
        }
        case "Return": {
            if (expr.body != null) {
                const value = yield* evaluateExpression(expr.body, scope);
                throw { type: "return", value };
            }
            throw { type: "return" };
        }
        case "Apply": {
            const fn = yield* evaluateExpression(expr.callee, scope);
            assert.nonNullable(fn);
            assertInstance(fn, FnValue);
            const args: Value[] = [];
            for (const arg of expr.args) {
                const value = yield* evaluateExpression(arg, scope);
                assert.nonNullable(value);
                args.push(value);
            }
            const fnScope = fn.initFnScope(args);
            try {
                return yield* evaluateExpression(fn.body, fnScope);
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
            const target = yield* evaluateExpression(expr.target, scope);
            assert.nonNullable(target);
            assertInstance(target, TupleValue);
            return target.get(expr.property.name);
        }
        case "Operator": {
            const lhs = yield* evaluateExpression(expr.lhs, scope);
            assert.nonNullable(lhs);
            const rhs = yield* evaluateExpression(expr.rhs, scope);
            assert.nonNullable(rhs);
            // expr.op
            // TODO: implementation
            throw new Error("not implemented");
        }
        default:
            assert.unreachable<typeof expr>();
    }
}

export function* evaluateStatement(
    stmt: Statement,
    scope: Scope<Value>,
): Generator<void, void> {
    switch (stmt.type) {
        case "Expression": {
            yield* evaluateExpression(stmt.expr, scope);
            break;
        }
        case "Let": {
            const value = yield* evaluateExpression(stmt.init, scope);
            assert.nonNullable(value);
            scope.define(stmt.dest.name, { value, writable: false });
            break;
        }
        default:
            assert.unreachable<typeof stmt>();
    }
}
