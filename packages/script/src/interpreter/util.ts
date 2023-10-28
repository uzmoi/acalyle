import { typeOf } from "emnorst";
import type { SourceLocation } from "../parser";
import { MetaValue, RuntimeError } from "./meta-value";

export class TypeError extends RuntimeError {
    constructor(
        readonly expectType: string,
        readonly actualType: string,
        loc: SourceLocation,
    ) {
        super("type-mismatch", loc);
    }
}

export const checkInstance = <A extends {}, T extends A>(
    value: A,
    ctor: new (...args: never) => T,
    node: { loc: SourceLocation },
): T | MetaValue => {
    if (value instanceof MetaValue || value instanceof ctor) return value;
    return new TypeError(ctor.name, typeOf(value), node.loc);
};
