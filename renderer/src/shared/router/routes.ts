import type { Normalize } from "emnorst";
import { type MatchParams, type Part, parsePattern } from "./pattern";
import { Route } from "./route";
import type { Routing } from "./types";
import type { RemoveTail } from "./util";

const matchPart = <T extends string>(
    part: Part,
    path: readonly string[],
    matchParams: MatchParams<T>,
) => {
    if (typeof part === "string") {
        if (part === "" || path[0] === part) {
            return {
                path: part === "" ? path : path.slice(1),
                matchParams,
            };
        }
        return;
    } else {
        if ((part.mark === "+" || part.mark === "") && path.length === 0) {
            return;
        }
        if (part.mark === "+" || part.mark === "*") {
            return {
                path: [],
                matchParams: { ...matchParams, [part.key]: path },
            };
        } else {
            return {
                path: path.slice(1),
                matchParams: { ...matchParams, [part.key]: path[0] },
            };
        }
    }
};

if (import.meta.vitest) {
    const { it, describe, expect } = import.meta.vitest;
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
}

// prettier-ignore
type RouteEntries<in T extends string, out ParamKeys extends string, R> = {
    [P in T as RemoveTail<P, `/${string}`>]: (
        Route<
            P extends `${string}/${infer P}` ? P : "",
            (P extends `:${infer P}` ? RemoveTail<P, `/${string}`> : never) | ParamKeys,
            R
        >
    );
};

export const routes: {
    <T extends string, ParamKeys extends string, R>(
        routes: Normalize<RouteEntries<T, ParamKeys, R>>,
    ): Route<T, ParamKeys, R>;
    <T extends Routing<string, string>, R>(
        routes: Normalize<RouteEntries<T["path"], T["paramKeys"], R>>,
    ): Route<T["path"], T["paramKeys"], R>;
} = <T extends string, ParamKeys extends string, R>(
    routeRecord: Normalize<RouteEntries<T, ParamKeys, R>>,
): Route<T, ParamKeys, R> => {
    const routeEntries = Object.keys(routeRecord).map(key => {
        const [part = "", ...restPattern] = parsePattern(key).parts;
        const route = restPattern.reduceRight<Route<string, ParamKeys, R>>(
            (accum, part) => {
                const partString =
                    typeof part === "string"
                        ? part
                        : ":" + part.key + part.mark;
                return routes({ [partString]: accum });
            },
            // prettier-ignore
            routeRecord[key as keyof typeof routeRecord] as Route<string, ParamKeys, R>,
        );
        return { part, route };
    });
    return new Route((path, matchParams) => {
        for (const { part, route } of routeEntries) {
            const partMatchResult = matchPart(part, path, matchParams);
            if (partMatchResult != null) {
                const result = route.get(
                    partMatchResult.path,
                    partMatchResult.matchParams,
                );
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    });
};

if (import.meta.vitest) {
    const { it, describe, expect } = import.meta.vitest;
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
}

export const page = <ParamKeys extends string, R>(
    page: (params: MatchParams<ParamKeys>) => R,
): Route<"", ParamKeys, R> => {
    return new Route((path, matchParams) => {
        if (path.length !== 0) {
            return null;
        }
        return page(matchParams);
    });
};

export const child = <T extends string, ParamKeys extends string, R>(
    child: (
        path: readonly string[],
        params: MatchParams<ParamKeys>,
    ) => R | null,
): Route<T, ParamKeys, R> => {
    return new Route(child);
};