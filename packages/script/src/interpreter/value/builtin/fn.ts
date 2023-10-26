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
}
