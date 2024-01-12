import type { IfUnion } from "emnorst";
import { expectTypeOf, test } from "vitest";
import type { Loc, SourceLocation } from "./location";
import type { Expression, Statement } from "./types";

type Node<T = {}> = Expression<T> | Statement<T>;

test("has type property", () => {
    const type = expectTypeOf<Node>().toHaveProperty("type");
    type.toBeString();
    type.not.toEqualTypeOf<string>();
});

test("type not duplicated", () => {
    type DuplicatedTypeOf<T, Original = T> = T extends { type: infer Type }
        ? IfUnion<Extract<Original, { type: Type }>, Type, never>
        : never;
    expectTypeOf<DuplicatedTypeOf<Node>>().toBeNever();
});

test("extend property", () => {
    expectTypeOf<Node<Loc>>()
        .toHaveProperty("loc")
        .toEqualTypeOf<SourceLocation>();
});
