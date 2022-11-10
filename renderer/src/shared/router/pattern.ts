import type { Meta } from "emnorst";
import type { Routing } from "./types";
import type { RemoveTail } from "./util";

export type Mark = "+" | "*" | "?";

export type Part = string | { key: string; mark: Mark | "" };

const parsePatternPart = (part: string): Part => {
    const match = /^:(\w*)([+*?]?)/.exec(part);
    return match == null
        ? part
        : { key: match[1], mark: match[2] as Mark | "" };
};

export const parsePattern = (pattern: string): Part[] => {
    return pattern.split("/").filter(Boolean).map(parsePatternPart);
};

type ParamKey<T extends string> = T extends `:${infer U}` ? U : never;

export type ParseStringPath<T extends string> =
    T extends `${infer U}/${infer Rest}`
        ? ParamKey<U> | ParseStringPath<Rest>
        : ParamKey<T>;

// prettier-ignore
export type MatchParams<in T extends string> = {
    [P in T as RemoveTail<P, Mark>]: (
        P extends `${string}+` ? [string, ...string[]]
        : P extends `${string}*` ? string[]
        : P extends `${string}?` ? string | undefined
        : string
    );
};

// prettier-ignore
export type NormalizePath<T extends string> =
    T extends `${infer Pre}//${infer Post}` ? NormalizePath<`${Pre}/${Post}`>
    : T extends `/${infer U}` | `${infer U}/` ? NormalizePath<U>
    : T;

export type Link<T extends string = string> = Meta<string, `link:${T}`>;

// prettier-ignore
export interface LinkBuilder<in T extends string> {
    <U extends T>(pattern: U, params: MatchParams<ParseStringPath<U>>): Link<U>;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<ParseStringPath<U>>] : []
    ): Link<U>;
}

// prettier-ignore
export const link = <T extends Routing<string, string>>(): LinkBuilder<NormalizePath<T["path"]>> => {
    return <U extends string>(pattern: U, params?: MatchParams<ParseStringPath<U>>) =>
        parsePattern(pattern).flatMap(part => {
            if(typeof part === "string") {
                return part;
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const param = params![part.key as keyof typeof params] as string[] | string | undefined;
            return part.mark === "?" && param === undefined ? [] : param;
        }).join("/") as Link<never>;
};

if (import.meta.vitest) {
    const { it, describe, expect } = import.meta.vitest;
    describe("link", () => {
        it("変換なし", () => {
            expect(link()("")).toBe("");
            expect(link()("hoge")).toBe("hoge");
            expect(link()("hoge/fuga")).toBe("hoge/fuga");
        });
        it("normalize path", () => {
            expect(link()("/hoge///fuga/")).toBe("hoge/fuga");
        });
        it("params埋め込み", () => {
            expect(
                link()("normal/:/:option?/:many*", {
                    "": "any",
                    option: undefined,
                    many: ["foo", "bar"],
                }),
            ).toBe("normal/any/foo/bar");
        });
    });
}
