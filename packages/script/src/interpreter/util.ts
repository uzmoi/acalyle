import { typeOf } from "emnorst";

export const assertInstance: <A extends {}, T extends A>(
    node: A,
    type: new (...args: never) => T,
) => asserts node is T = (node, type) => {
    if (!(node instanceof type)) {
        throw new TypeError(
            `expected instanceof ${type.name}, but unexpected ${typeOf(node)}`,
        );
    }
};
