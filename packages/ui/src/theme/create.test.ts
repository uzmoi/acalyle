import { expect, test } from "vitest";
import { createTheme } from "./create";

test("createTheme", () => {
    const themeStyle = createTheme<{
        hoge: `var(--${string})`;
    }>("prefix", {
        hoge: "value",
    });

    expect(themeStyle).toEqual({
        "--prefix-hoge": "value",
    });
});

test("nest", () => {
    const themeStyle = createTheme<{
        hoge: { fuga: `var(--${string})` };
    }>("prefix", {
        hoge: { fuga: "value" },
    });

    expect(themeStyle).toEqual({
        "--prefix-hoge-fuga": "value",
    });
});
