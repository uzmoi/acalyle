import type { IfUnion } from "emnorst";
import { expectTypeOf, test } from "vitest";
import type { SourceLocation } from "./location";
import type { Expression, Statement } from "./types";

test("has type property", () => {
    const type = expectTypeOf<Expression | Statement>().toHaveProperty("type");
    type.toBeString();
    type.not.toEqualTypeOf<string>();
});

test("type not duplicated", () => {
    type DuplicatedTypeOf<T, Original = T> = T extends { type: infer Type }
        ? IfUnion<Extract<Original, { type: Type }>, Type, never>
        : never;
    expectTypeOf<DuplicatedTypeOf<Expression | Statement>>().toBeNever();
});

test("has loc property", () => {
    expectTypeOf<Expression | Statement>()
        .toHaveProperty("loc")
        .toEqualTypeOf<SourceLocation>();
});
