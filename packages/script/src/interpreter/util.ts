import { typeOf } from "emnorst";
import type { SourceLocation } from "../parser";
import { MetaValue, RuntimeError } from "./meta-value";

export class TypeError extends RuntimeError {
    constructor(
        readonly message: string,
        readonly actualType: string,
        loc: SourceLocation,
    ) {
        super(loc);
    }
}

export const checkInstance = <A extends {}, T extends A>(
    value: A,
    type: new (...args: never) => T,
    node: { loc: SourceLocation },
): T | MetaValue => {
    if (value instanceof MetaValue || value instanceof type) return value;
    return new TypeError(type.name, typeOf(value), node.loc);
};
