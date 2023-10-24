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
    UnitValue,
} from "./value/builtin";
import type { Value } from "./value/types";

export function* evaluateExpression(
    expr: Expression,
    scope: Scope<Value>,
): Generator<void, Value> {
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
                // NOTE: TypeScriptのバグなのか何なのか、型推論をしてくれないので
                // 明示的にアノテーションを書かないといけない。
                const node: Expression = expr.values[i]!;
                const value: Value | undefined = yield* evaluateExpression(
                    node,
                    scope,
                );
                assertInstance(value, StringValue, node);
                string += value.value;
                string += expr.strings[i + 1]!;
            }
            return new StringValue(string);
        }
        case "Tuple": {
            const elements: Value[] = [];
            for (const element of expr.elements) {
                const value = yield* evaluateExpression(element, scope);
                elements.push(value);
            }
            const properties: Record<string, Value> = {};
            for (const [key, property] of expr.properties) {
                const value = yield* evaluateExpression(property, scope);
                properties[key.name] = value;
            }
            return new TupleValue(elements, properties);
        }
        case "Block": {
            const blockScope = scope.child();
            for (const stmt of expr.stmts) {
                evaluateStatement(stmt, blockScope);
            }
            if (expr.last == null) {
                return new UnitValue();
            }
            return yield* evaluateExpression(expr.last, blockScope);
        }
        case "If": {
            const cond = yield* evaluateExpression(expr.cond, scope);
            assertInstance(cond, BoolValue, expr.cond);
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
            throw { type: "return", value: new UnitValue() };
        }
        case "Apply": {
            const fn = yield* evaluateExpression(expr.callee, scope);
            assertInstance(fn, FnValue, expr);
            const args: Value[] = [];
            for (const arg of expr.args) {
                const value = yield* evaluateExpression(arg, scope);
                args.push(value);
            }
            const fnScope = fn.initFnScope(args);
            try {
                return yield* evaluateExpression(fn.body, fnScope);
            } catch (error) {
                if (
                    (error as { type: "return"; value: Value })?.type ===
                    "return"
                ) {
                    return (error as { type: "return"; value: Value }).value;
                }
                throw error;
            }
        }
        case "Property": {
            const target = yield* evaluateExpression(expr.target, scope);
            assertInstance(target, TupleValue, expr.target);
            return target.get(expr.property.name);
        }
        case "Operator": {
            const _lhs = yield* evaluateExpression(expr.lhs, scope);
            const _rhs = yield* evaluateExpression(expr.rhs, scope);
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
            scope.define(stmt.dest.name, { value, writable: false });
            break;
        }
        default:
            assert.unreachable<typeof stmt>();
    }
}
