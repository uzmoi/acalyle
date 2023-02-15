import { describe, expect, it } from "vitest";
import { parsePattern } from "./pattern";
import { matchPart, page, routes } from "./routes";

describe("matchPart", () => {
    describe("string part", () => {
        it("pathが空", () => {
            expect(matchPart("hoge", [], {})).toBeUndefined();
        });
        it("pathがpartと不一致", () => {
            expect(matchPart("hoge", ["foo"], {})).toBeUndefined();
        });
        it("pathがpartと一致", () => {
            expect(matchPart("hoge", ["hoge", "fuga"], {})).toEqual({
                path: ["fuga"],
                matchParams: {},
            });
        });
    });
    describe.each<{
        part: string;
        empty: ReturnType<typeof matchPart<never>>;
        nonEmpty: ReturnType<typeof matchPart<never>>;
    }>([
        {
            part: "",
            empty: { path: [], matchParams: {} },
            nonEmpty: { path: ["foo", "bar"], matchParams: {} },
        },
        {
            part: ":hoge",
            empty: undefined,
            nonEmpty: { path: ["bar"], matchParams: { hoge: "foo" } },
        },
        {
            part: ":hoge?",
            empty: { path: [], matchParams: { hoge: undefined } },
            nonEmpty: { path: ["bar"], matchParams: { hoge: "foo" } },
        },
        {
            part: ":hoge*",
            empty: { path: [], matchParams: { hoge: [] } },
            nonEmpty: { path: [], matchParams: { hoge: ["foo", "bar"] } },
        },
        {
            part: ":hoge+",
            empty: undefined,
            nonEmpty: { path: [], matchParams: { hoge: ["foo", "bar"] } },
        },
    ])('part: "$part"', ({ part: partString, empty, nonEmpty }) => {
        const [part = ""] = parsePattern(partString).parts;
        it("空のpath", () => {
            expect(matchPart(part, [], {})).toEqual(empty);
        });
        it("空ではない任意のpath", () => {
            expect(matchPart(part, ["foo", "bar"], {})).toEqual(nonEmpty);
        });
    });
});

describe("routes", () => {
    it("空文字列キー", () => {
        const route = routes({ "": page(() => "page") });
        expect(route.get([], {})).toBe("page");
    });
    it("pattern part", () => {
        const route = routes({ page: page(() => "page") });
        expect(route.get(["page"], {})).toBe("page");
    });
    it("pattern", () => {
        const route = routes({ "nest/page": page(() => "page") });
        expect(route.get(["nest", "page"], {})).toBe("page");
    });
    it("複数キー", () => {
        const route = routes({
            "": page(() => 0),
            ":hoge": page(() => 1),
            ":fuga/piyo": page(() => 2),
        });
        expect(route.get([], {})).toBe(0);
        expect(route.get(["foo"], {})).toBe(1);
        expect(route.get(["bar", "piyo"], {})).toBe(2);
    });
});
