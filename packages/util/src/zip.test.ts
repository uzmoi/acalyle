import { expect, test } from "vitest";
import { zip } from "./zip";

test("zip", () => {
    expect(
        zip([
            [0, 1, 2],
            ["0", "1"],
        ]),
    ).toStrictEqual([
        [0, "0"],
        [1, "1"],
    ]);
});

test("max", () => {
    expect(zip([[0], []], true)).toStrictEqual([[0, undefined]]);
});
