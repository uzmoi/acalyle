import { zip } from "@acalyle/util";
import type { Expression, IdentExpression } from "../../../parser";
import type { Scope } from "../../scope";
import { Value } from "../types";

export class FnValue extends Value {
    constructor(
        readonly params: readonly IdentExpression[],
        readonly body: Expression,
        readonly scope: Scope<Value>,
    ) {
        super();
    }
    initFnScope(args: readonly Value[]): Scope<Value> {
        const fnScope = this.scope.child();
        for (const [param, arg] of zip(
            [this.params, args.slice(0, this.params.length)],
            true,
        )) {
            if (arg == null) {
                throw { type: "missing-arguments" };
            }
            fnScope
                .define(param.name, { value: arg, writable: false })
                .getOrThrow();
        }
        return fnScope;
    }
}
