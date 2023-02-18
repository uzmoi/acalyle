import { describe, expect, test } from "vitest";
import { AcalyleMemoTag } from "./tag";

describe("AcalyleTag", () => {
    describe("nameが空ならnull", () => {
        test.each(["#", "@:prop"])('"%s"', string => {
            const tag = AcalyleMemoTag.fromString(string);
            expect(tag).toBeNull();
        });
    });
    describe("#normal-tag", () => {
        test("#を省略可能", () => {
            const tag = AcalyleMemoTag.fromString("hoge");
            expect(tag?.symbol).toBe("#hoge");
        });
        test(".symbol", () => {
            const tag = AcalyleMemoTag.fromString("#hoge:42");
            expect(tag?.symbol).toBe("#hoge:42");
        });
        test(".propは常にnull", () => {
            const tag = AcalyleMemoTag.fromString("#hoge:42");
            expect(tag?.prop).toBeNull();
        });
    });
    describe("@control-tag", () => {
        test(".symbol", () => {
            const tag = AcalyleMemoTag.fromString("@hoge");
            expect(tag?.symbol).toBe("@hoge");
        });
        test("コロンが無いなら.propはnull", () => {
            const tag = AcalyleMemoTag.fromString("@hoge");
            expect(tag?.prop).toBeNull();
        });
        test("コロンで終わるなら.propはnull", () => {
            const tag = AcalyleMemoTag.fromString("@hoge:");
            expect(tag?.prop).toBeNull();
        });
        test("コロンの後に1文字以上有るなら.propはコロンの後の文字列", () => {
            const tag = AcalyleMemoTag.fromString("@hoge:42");
            expect(tag?.prop).toBe("42");
        });
    });
    describe("toString", () => {
        test("prop無し", () => {
            const tag = AcalyleMemoTag.fromString("@hoge");
            expect(tag?.toString()).toBe("@hoge");
        });
        test("prop有り", () => {
            const tag = AcalyleMemoTag.fromString("@hoge:42");
            expect(tag?.toString()).toBe("@hoge:42");
        });
    });
});
