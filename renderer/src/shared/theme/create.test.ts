import { describe, expect, test } from "vitest";
import { themeNames } from "./create";

describe("theme create", () => {
    test("vars", () => {
        const vars = themeNames("prefix", { hoge: ["foo"] } as const);
        expect(vars.hoge.foo).toBe("var(--prefix-hoge-foo)");
    });
    test("themeStyle", () => {
        const vars = themeNames("prefix", { hoge: ["foo"] } as const);
        const themeStyle = vars.createTheme({
            hoge: { foo: "cssValue" },
        });
        expect(themeStyle).toEqual({ "--prefix-hoge-foo": "cssValue" });
    });
    describe("themeStyle with default", () => {
        const vars = themeNames("prefix", {
            hoge: { foo: "defaultValue" },
        } as const);
        test("すべて指定", () => {
            const themeStyle = vars.createTheme({
                hoge: { foo: "cssValue" },
            });
            expect(themeStyle).toEqual({ "--prefix-hoge-foo": "cssValue" });
        });
        test("値が無い", () => {
            const themeStyle = vars.createTheme({
                hoge: {},
            });
            expect(themeStyle).toEqual({ "--prefix-hoge-foo": "defaultValue" });
        });
        test("オブジェクトが無い", () => {
            const themeStyle = vars.createTheme({});
            expect(themeStyle).toEqual({ "--prefix-hoge-foo": "defaultValue" });
        });
    });
});
