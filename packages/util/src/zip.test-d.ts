import { describe, expectTypeOf, test } from "vitest";
import { type ZipBy, zip } from "./zip";

describe("Min", () => {
    type Min<T extends unknown[]> = ZipBy<[T], null, false>;
    test("min", () => {
        expectTypeOf<Min<[] | [unknown]>>().toEqualTypeOf<[]>();
        expectTypeOf<Min<[0] | ["", ""]>>().toEqualTypeOf<[null]>();
    });
    test("array", () => {
        expectTypeOf<Min<[0, 1] | string[]>>().toEqualTypeOf<null[]>();
        expectTypeOf<Min<[0, 1] | unknown[]>>().toEqualTypeOf<null[]>();
    });
});

describe("Max", () => {
    type Max<T extends unknown[]> = ZipBy<[T], null, true>;
    test("max", () => {
        expectTypeOf<Max<[] | [unknown]>>().toEqualTypeOf<[null]>();
        expectTypeOf<Max<[0] | ["", ""]>>().toEqualTypeOf<[null, null]>();
    });
    test("array", () => {
        expectTypeOf<Max<[0, 1] | string[]>>().toEqualTypeOf<null[]>();
        expectTypeOf<Max<[0, 1] | unknown[]>>().toEqualTypeOf<null[]>();
    });
});

test("zip arrays", () => {
    const array: [number[], string[]] = [[], []];
    expectTypeOf(zip(array)).toEqualTypeOf<[number, string][]>();
});

test("zip arrays allow missing", () => {
    const array: [number[], string[]] = [[], []];
    expectTypeOf(zip(array, true)).toEqualTypeOf<[number, string][]>();
});

test("zip tuple + array", () => {
    const array: [[0, 1], string[]] = [[0, 1], []];
    expectTypeOf(zip(array)).toEqualTypeOf<[0 | 1, string][]>();
});

test("zip tuple + array allow missing", () => {
    const array: [[0, 1], string[]] = [[0, 1], []];
    expectTypeOf(zip(array, true)).toEqualTypeOf<
        [0 | 1 | undefined, string][]
    >();
});

test("zip tuple", () => {
    const array = [
        [0, 1, 2],
        ["zero", "one"],
    ] as const;
    expectTypeOf(zip(array)).toEqualTypeOf<[[0, "zero"], [1, "one"]]>();
});

test("zip tuple allow missing", () => {
    const array = [
        [0, 1, 2],
        ["zero", "one"],
    ] as const;
    expectTypeOf(zip(array, true)).toEqualTypeOf<
        [[0, "zero"], [1, "one"], [2, undefined]]
    >();
});

test("unzip", () => {
    const array: [number, string][] = [];
    expectTypeOf(zip(array)).toEqualTypeOf<[number[], string[]]>();
});

test("unzip allow missing", () => {
    const array: [number, string][] = [];
    expectTypeOf(zip(array, true)).toEqualTypeOf<[number[], string[]]>();
});

test("unzip tuple + array", () => {
    const array: [0 | 1, string][] = [];
    expectTypeOf(zip(array)).toEqualTypeOf<[(0 | 1)[], string[]]>();
});

test("unzip (tuple | array) union", () => {
    const array: ([0, 1] | string[])[] = [[]];
    expectTypeOf(zip(array)).toEqualTypeOf<(string | 0 | 1)[][]>();
});

test("unzip tuple + array allow missing", () => {
    const array: [0 | 1, string][] = [];
    expectTypeOf(zip(array, true)).toEqualTypeOf<[(0 | 1)[], string[]]>();
});
