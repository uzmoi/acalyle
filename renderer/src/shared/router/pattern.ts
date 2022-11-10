import { Meta, SplitString, isArray, updateAt } from "emnorst";
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

export interface Pattern {
    parts: Part[];
    params: string[];
}

export const parsePattern = (pattern: string): Pattern => {
    const partStrings = pattern.split("/").filter(Boolean);
    const lastPartWithParams = partStrings.at(-1);
    let params: string[] = [];
    parseParams: if (lastPartWithParams != null) {
        let paramsStartIndex = lastPartWithParams.indexOf("?");
        if (paramsStartIndex !== -1) {
            if (lastPartWithParams.startsWith(":")) {
                if (paramsStartIndex + 1 === lastPartWithParams.length) {
                    break parseParams;
                }
                if (lastPartWithParams[paramsStartIndex + 1] === "?") {
                    paramsStartIndex++;
                }
                const lastPart = lastPartWithParams.slice(0, paramsStartIndex);
                updateAt(partStrings, -1, lastPart);
            } else {
                const lastPart = lastPartWithParams.slice(0, paramsStartIndex);
                if (lastPart === "") {
                    partStrings.pop();
                } else {
                    updateAt(partStrings, -1, lastPart);
                }
            }
            params = lastPartWithParams
                .slice(paramsStartIndex + 1)
                .split("&")
                .filter(Boolean);
        }
    }
    return { parts: partStrings.map(parsePatternPart), params };
};

if (import.meta.vitest) {
    const { it, describe, expect } = import.meta.vitest;
    describe("parsePattern", () => {
        it("temp", () => {
            const parsePattern = (pattern: string): Part[] =>
                pattern.split("/").filter(Boolean).map(parsePatternPart);
            expect(parsePattern("")).toEqual([]);
        });
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
}

type ParamKey<T extends string> = T extends `:${infer U}` ? U : never;

// prettier-ignore
export type MatchParamKeyOf<Pattern extends string> = (
    SplitString<Pattern, "/"> extends [
        ...(infer InitPart extends string)[],
        infer LastPart extends string,
    ]
        ? ParamKey<InitPart>
        | (LastPart extends `${infer P}?${infer S}`
            ? ParamKey<P> | SplitString<S, "&">[number]
            : ParamKey<LastPart>
        )
    : never
);

export type WithSearchParams<T extends string> = `${T}${"" | `?${string}`}`;

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
    <U extends WithSearchParams<T>>(patternString: U, params: MatchParams<MatchParamKeyOf<U>>): Link<U>;
    <U extends WithSearchParams<T>>(
        patternString: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<MatchParamKeyOf<U>>] : []
    ): Link<U>;
}

export const link = <T extends Routing<string, string>>(): LinkBuilder<
    NormalizePath<T["path"]>
> => {
    return <U extends string>(
        patternString: U,
        args?: MatchParams<MatchParamKeyOf<U>>,
    ) => {
        const { parts, params } = parsePattern(patternString);
        const getArg = (key: string) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return args![key as keyof typeof args] as
                | string[]
                | string
                | undefined;
        };
        const path = parts
            .flatMap(part => {
                if (typeof part === "string") {
                    return part;
                }
                const arg = getArg(part.key);
                return part.mark === "?" && arg === undefined ? [] : arg;
            })
            .join("/");
        const searchParams = params
            .flatMap(param => {
                const arg = getArg(param);
                if (isArray(arg)) {
                    return `${param}=${arg.join()}`;
                }
                if (typeof arg === "string") {
                    return `${param}=${arg}`;
                }
                return [];
            })
            .join("&");
        return (path +
            (searchParams === "" ? "" : `?${searchParams}`)) as Link<never>;
    };
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
