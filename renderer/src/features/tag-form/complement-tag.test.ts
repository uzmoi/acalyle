// cspell:word damerau hogera hoga

import { describe, expect, test, vi } from "vitest";
import { complementTagSymbol } from "./complement-tag";

vi.mock("./damerau-levenshtein", async () => {
    const module = await vi.importActual("damerau-levenshtein");
    return { damerauLevenshtein: (module as { default: unknown }).default };
});

describe("complementTagSymbol", () => {
    test("inputより浅いタグを除外", () => {
        expect(complementTagSymbol(["#hoge", "#hoge/fuga"], "#hoge/")).toEqual([
            "#hoge/fuga",
        ]);
    });
    test("別タイプのタグを除外", () => {
        expect(complementTagSymbol(["@hoge", "#hoge"], "#hoge")).toEqual([
            "#hoge",
        ]);
    });
    test("headを省略してtypeを無視", () => {
        const tags = ["#hoge", "@hoge"];
        expect(complementTagSymbol(tags, "hoge")).toEqual(tags);
    });
    describe("同じ階層数", () => {
        test.each(["#hoge", "#hoge/fuga"])("完 全 に 一 致 (%s)", tag => {
            expect(complementTagSymbol([tag], tag)).toEqual([tag]);
        });
        test("startsWithでマッチ", () => {
            const tags = ["#hoge/fuga"];
            expect(complementTagSymbol(tags, "#hoge/fu")).toEqual(tags);
        });
        test("includesでマッチ", () => {
            const tags = ["#hoge/fuga"];
            expect(complementTagSymbol(tags, "#hoge/ug")).toEqual(tags);
        });
        describe("編集距離", () => {
            test("よし通れ", () => {
                const tag = "#type";
                expect(complementTagSymbol([tag], "#typo")).toEqual([tag]);
            });
            test("何だお前", () => {
                expect(complementTagSymbol(["#live"], "#evil")).toEqual([]);
            });
        });
    });
    test("途中が違うと最後だけあっててもだめ", () => {
        expect(
            complementTagSymbol(
                ["#piyo", "#hoge/piyo", "#hoge/fuga/piyo"],
                "#xxx/piyo",
            ),
        ).toEqual([]);
    });
    test("まるごと入ってたら通す", () => {
        const tags = ["#hoge/fuga/piyo", "#hoge/fuga/piyo/foo"];
        expect(complementTagSymbol(tags, "#fuga/piyo")).toEqual(tags);
    });
    test("順番", () => {
        const tags = [
            "#hoge",
            "#hoge/fuga",
            "hogera",
            "hoga",
            "#foo/hoge",
            "#bar/baz/hoge",
        ];
        expect(complementTagSymbol(tags, "#hoge")).toEqual(tags);
    });
});
