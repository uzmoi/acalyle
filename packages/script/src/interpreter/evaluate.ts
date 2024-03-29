import { zip } from "@acalyle/util";
import { assert } from "emnorst";
import type { Expression, Loc, SourceLocation, Statement } from "../parser";
import { MetaValue, RuntimeError } from "./meta-value";
import type { Scope } from "./scope";
import { checkInstance } from "./util";
import {
    BoolValue,
    FnValue,
    IntValue,
    StringValue,
    TupleValue,
    UnitValue,
} from "./value/builtin";
import type { Value } from "./value/types";

export class ReturnControl extends MetaValue {
    constructor(
        readonly value: Value,
        loc: SourceLocation,
    ) {
        super(loc);
    }
}

export class BreakControl extends MetaValue {
    constructor(
        readonly value: Value,
        loc: SourceLocation,
    ) {
        super(loc);
    }
}

type EvaluateStepType = "if" | "loop" | "break" | "apply" | "return" | "let";

export type EvaluateStep = {
    type: EvaluateStepType;
    loc: SourceLocation;
    scope: Scope<Value>;
};

const step = (
    type: EvaluateStepType,
    loc: SourceLocation,
    scope: Scope<Value>,
): EvaluateStep => {
    return { type, loc, scope };
};

export function* evaluateExpression(
    expr: Expression<Loc>,
    scope: Scope<Value>,
): Generator<EvaluateStep, Value | MetaValue> {
    switch (expr.type) {
        case "Ident": {
            return scope.get(expr.name, expr.loc);
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
                const node: Expression<Loc> = expr.values[i]!;
                const value: StringValue | MetaValue = checkInstance(
                    yield* evaluateExpression(node, scope),
                    StringValue,
                    node,
                );
                if (value instanceof MetaValue) return value;
                string += value.value;
                string += expr.strings[i + 1]!;
            }
            return new StringValue(string);
        }
        case "Tuple": {
            const elements: Value[] = [];
            for (const element of expr.elements) {
                const value = yield* evaluateExpression(element, scope);
                if (value instanceof MetaValue) return value;
                elements.push(value);
            }
            const properties: Record<string, Value> = {};
            for (const [key, property] of expr.properties) {
                const value = yield* evaluateExpression(property, scope);
                if (value instanceof MetaValue) return value;
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
            const cond = checkInstance(
                yield* evaluateExpression(expr.cond, scope),
                BoolValue,
                expr.cond,
            );
            if (cond instanceof MetaValue) return cond;
            yield step("if", expr.loc, scope);
            return yield* cond.value
                ? evaluateExpression(expr.thenBody, scope)
                : evaluateExpression(expr.elseBody!, scope);
        }
        case "Loop": {
            while (true) {
                yield step("loop", expr.loc, scope);
                const value = yield* evaluateExpression(expr.body, scope);
                if (
                    value instanceof BreakControl ||
                    value instanceof ReturnControl
                ) {
                    return value.value;
                }
                if (value instanceof MetaValue) return value;
            }
        }
        case "Break": {
            let result: Value;
            if (expr.body == null) {
                result = new UnitValue();
            } else {
                const value = yield* evaluateExpression(expr.body, scope);
                if (value instanceof MetaValue) return value;
                result = value;
            }
            yield step("break", expr.loc, scope);
            return new BreakControl(result, expr.loc);
        }
        case "Fn": {
            return new FnValue(expr.params, expr.body, scope);
        }
        case "Return": {
            let result: Value;
            if (expr.body == null) {
                result = new UnitValue();
            } else {
                const value = yield* evaluateExpression(expr.body, scope);
                if (value instanceof MetaValue) return value;
                result = value;
            }
            yield step("return", expr.loc, scope);
            return new ReturnControl(result, expr.loc);
        }
        case "Apply": {
            const fn = checkInstance(
                yield* evaluateExpression(expr.callee, scope),
                FnValue,
                expr.callee,
            );
            if (fn instanceof MetaValue) return fn;
            const fnScope = fn.scope.child();
            if (fn.params.length > expr.args.length) {
                return new RuntimeError("missing-arguments", expr.loc);
            }
            if (fn.params.length < expr.args.length) {
                return new RuntimeError("surplus-arguments", expr.loc);
            }
            for (const [param, arg] of zip([fn.params, expr.args])) {
                const value = yield* evaluateExpression(arg, scope);
                if (value instanceof MetaValue) return value;
                fnScope.define(
                    param.name,
                    { value, writable: false },
                    param.loc,
                );
            }
            yield step("apply", expr.loc, scope);
            const result = yield* evaluateExpression(fn.body, fnScope);
            if (result instanceof BreakControl) {
                return new RuntimeError("invalid-break", fn.body.loc);
            }
            if (result instanceof ReturnControl) {
                return result.value;
            }
            return result;
        }
        case "Property": {
            const target = checkInstance(
                yield* evaluateExpression(expr.target, scope),
                TupleValue,
                expr.target,
            );
            if (target instanceof MetaValue) return target;
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
    stmt: Statement<Loc>,
    scope: Scope<Value>,
): Generator<EvaluateStep, MetaValue | undefined> {
    switch (stmt.type) {
        case "Expression": {
            yield* evaluateExpression(stmt.expr, scope);
            break;
        }
        case "Let": {
            const value = yield* evaluateExpression(stmt.init, scope);
            if (value instanceof MetaValue) return value;
            scope.define(
                stmt.dest.name,
                { value, writable: false },
                stmt.dest.loc,
            );
            yield step("let", stmt.loc, scope);
            break;
        }
        default:
            assert.unreachable<typeof stmt>();
    }
}
