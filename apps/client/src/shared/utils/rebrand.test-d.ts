import type { Brand } from "@uzmoi/ut/types";
import { assertType, describe, expectTypeOf, test } from "vitest";
import type { Rebrand } from "./rebrand";

type A = string & Brand<"A">;
type B = string & Brand<"B">;
type C = string & Brand<"C">;

declare const a: A;
declare const b: B;

declare const dummy: <T>() => T;

declare const rebrand: Rebrand<{
  a(a: A): B; // A -> B
  b(b: B): A; // B -> A
  c(b: B): C; // B -> C
}>;

describe("正常系", () => {
  test("型を指定せずに設定したリブランドができること", () => {
    expectTypeOf(rebrand(a)).toEqualTypeOf<B>();
  });

  test("リブランド先の型が複数あるとき、デフォルトでユニオンになること", () => {
    expectTypeOf(rebrand(b)).toEqualTypeOf<A | C>();
  });

  test("リブランド先の型が複数あるとき、型引数で選択できること", () => {
    expectTypeOf(rebrand<A>(b)).toEqualTypeOf<A>();
    expectTypeOf(rebrand<C>(b)).toEqualTypeOf<C>();
  });

  test("リブランド先の型が複数あるとき、型引数を指定しなくとも推論可能なこと", () => {
    assertType<A>(rebrand(b));
    assertType<C>(rebrand(b));
  });

  test("nullable", () => {
    expectTypeOf(rebrand(dummy<A | null>())).toEqualTypeOf<B | null>();
  });

  test("array", () => {
    expectTypeOf(rebrand(dummy<A[]>())).toEqualTypeOf<readonly B[]>();
  });

  test("array + nullable", () => {
    const value = dummy<(A | null)[] | null>();
    expectTypeOf(rebrand(value)).toEqualTypeOf<readonly (B | null)[] | null>();
  });
});

test("A -> B と B -> C ができても A -> C ができないこと", () => {
  // @ts-expect-error: A -> C は未設定
  assertType(rebrand<C>(a));
});

test("未知の型に対して return type が never にならないこと", () => {
  expectTypeOf(rebrand("")).not.toBeNever();

  // @ts-expect-error: return type を never にできない
  assertType<never>(rebrand(""));
  // @ts-expect-error: return type を never にできない
  assertType<never>(rebrand<never>(""));
});
