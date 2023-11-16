import type { Expression, IdentExpression, Loc } from "../../../parser";
import type { Scope } from "../../scope";
import { Value } from "../types";

export class FnValue extends Value {
    constructor(
        readonly params: readonly IdentExpression<Loc>[],
        readonly body: Expression<Loc>,
        readonly scope: Scope<Value>,
    ) {
        super();
    }
}
