import type { IfUnion } from "emnorst";
import { expectTypeOf, test } from "vitest";
import type { Expression, Statement } from "./types";

test("has type property", () => {
    expectTypeOf<Expression | Statement>().toHaveProperty("type");
});

test("type not duplicated", () => {
    type DuplicatedTypeOf<T, Original = T> = T extends { type: infer Type }
        ? IfUnion<Extract<Original, { type: Type }>, Type, never>
        : never;
    expectTypeOf<DuplicatedTypeOf<Expression | Statement>>().toBeNever();
});

test("has loc property", () => {
    expectTypeOf<Expression | Statement>().toHaveProperty("loc");
});
