import { typeOf } from "emnorst";
import type { SourceLocation } from "../parser";

export const assertInstance: <A extends {}, T extends A>(
    value: A,
    type: new (...args: never) => T,
    node: { loc: SourceLocation },
) => asserts value is T = (value, type, node) => {
    if (!(value instanceof type)) {
        throw new TypeError(
            `expected instanceof ${type.name}, but unexpected ${typeOf(
                value,
            )} (at index ${node.loc[0]})`,
        );
    }
};
