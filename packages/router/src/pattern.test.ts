import { describe, expect, it } from "vitest";
import { link, parsePattern } from "./pattern";

describe("parsePattern", () => {
    it("empty", () => {
        expect(parsePattern("")).toEqual({
            parts: [],
            params: [],
        });
    });
    it("empty part", () => {
        expect(parsePattern(":")).toEqual({
            parts: [{ key: "", mark: "" }],
            params: [],
        });
    });
    it("option part", () => {
        expect(parsePattern(":hoge?")).toEqual({
            parts: [{ key: "hoge", mark: "?" }],
            params: [],
        });
    });
    it("normal part + params", () => {
        expect(parsePattern(":hoge?foo")).toEqual({
            parts: [{ key: "hoge", mark: "" }],
            params: ["foo"],
        });
    });
    it("option part + params", () => {
        expect(parsePattern(":hoge??foo")).toEqual({
            parts: [{ key: "hoge", mark: "?" }],
            params: ["foo"],
        });
    });
    it("option part + empty params", () => {
        expect(parsePattern(":hoge??")).toEqual({
            parts: [{ key: "hoge", mark: "?" }],
            params: [],
        });
    });
    it("empty params", () => {
        expect(parsePattern("?")).toEqual({
            parts: [],
            params: [],
        });
    });
    it("params separated by '&'", () => {
        expect(parsePattern("?param1&param2")).toEqual({
            parts: [],
            params: ["param1", "param2"],
        });
    });
});

describe("link", () => {
    it("変換なし", () => {
        expect(link("")).toBe("");
        expect(link("hoge")).toBe("hoge");
        expect(link("hoge/fuga")).toBe("hoge/fuga");
    });
    it("normalize path", () => {
        expect(link("/hoge///fuga/")).toBe("hoge/fuga");
    });
    it("params埋め込み", () => {
        expect(
            link("normal/:/:option?/:many*", {
                "": "any",
                option: undefined,
                many: ["foo", "bar"],
            }),
        ).toBe("normal/any/foo/bar");
    });
});
