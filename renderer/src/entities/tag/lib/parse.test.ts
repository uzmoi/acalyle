import { describe, expect, it } from "vitest";
import { parseTag } from "./parse";

it("nameは1文字以上必要", () => {
    expect(parseTag("#")).toBeNull();
});

it("nameに')'は使用できない", () => {
    expect(parseTag("#tag)")).toBeNull();
});

describe("normal tag", () => {
    it("valid", () => {
        expect(parseTag("#tag")).toEqual({
            type: "normal",
            name: "tag",
            args: null,
        });
    });
    it("#は省略できる", () => {
        expect(parseTag("tag")).toEqual({
            type: "normal",
            name: "tag",
            args: null,
        });
    });
    it("引数は使用できない", () => {
        expect(parseTag("#tag()")).toBeNull();
    });
});

describe("control tag", () => {
    it("引数無し", () => {
        expect(parseTag("@tag")).toEqual({
            type: "control",
            name: "tag",
            args: null,
        });
    });
    it("引数が空", () => {
        expect(parseTag("@tag()")).toEqual({
            type: "control",
            name: "tag",
            args: null,
        });
    });
    it("引数有り", () => {
        expect(parseTag("@tag(args)")).toEqual({
            type: "control",
            name: "tag",
            args: "args",
        });
    });
    it("argsに'('は使用できない", () => {
        expect(parseTag("@tag(()")).toBeNull();
    });
});
