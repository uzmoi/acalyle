import { Meta, Nomalize } from "emnorst";

type RemoveHead<S extends string, Head extends string> = S extends `${Head}${infer P}` ? P : S;
type RemoveTail<S extends string, Tail extends string> = S extends `${infer P}${Tail}` ? P : S;

type Mark = "+" | "*" | "?";

export type MatchParams<in T extends string> = {
    [P in T as RemoveTail<P, Mark>]: (
        P extends `${string}+` ? [string, ...string[]]
        : P extends `${string}*` ? string[]
        : P extends `${string}?` ? string | undefined
        : string
    );
};

type ParamKey<T extends string> = T extends `:${infer U}` ? U : never;

export type ParseStringPath<T extends string> = T extends `${infer U}/${infer Rest}`
    ? ParamKey<U> | ParseStringPath<Rest>
    : ParamKey<T>;

type Part = string | { key: string, mark: Mark | "" };

const parsePatternPart = (part: string): Part => {
    const match = /^:(\w*)([+*?]?)/.exec(part);
    return match == null ? part
        : { key: match[1], mark: match[2] as Mark | "" };
};

const parsePattern = (pattern: string): Part[] =>
    pattern.split("/").filter(Boolean).map(parsePatternPart);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Route<in _Path extends string, out ParamKeys extends string, out R = unknown> {
    get(path: readonly string[], matchParams: MatchParams<ParamKeys>): R | null;
}

export const match: <Path extends string, ParamKeys extends string, R>(
    route: Route<Path, ParamKeys, R>,
    link: Link<Path>,
    ...args: [ParamKeys] extends [never]
        ? [] : [params: MatchParams<ParamKeys>]
) => R | null = <Path extends string, ParamKeys extends string, R>(
    route: Route<Path, ParamKeys, R>,
    link: Link<Path>,
    params: MatchParams<ParamKeys> = {} as never,
): R | null => {
    const path = link.split("/").filter(Boolean);
    return route.get(path, params);
};

export type Link<T extends string = string> = Meta<string, `link:${T}`>;

export interface LinkBuilder<in T extends string> {
    <U extends T>(pattern: U, params: MatchParams<ParseStringPath<U>>): Link<U>;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<ParseStringPath<U>>] : []
    ): Link<U>;
}

export const link = <T extends Routing<string, string>>(): LinkBuilder<NomalizePath<T["path"]>> => {
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

if(import.meta.vitest) {
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
            expect(link()("normal/:/:option?/:many*", {
                "": "any",
                option: undefined,
                many: ["foo", "bar"],
            })).toBe("normal/any/foo/bar");
        });
    });
}

const matchPart = <T extends string>(
    part: Part,
    path: readonly string[],
    matchParams: MatchParams<T>,
) => {
    if(typeof part === "string") {
        if(part === "" || path[0] === part) {
            return {
                path: part === "" ? path : path.slice(1),
                matchParams,
            };
        }
        return;
    } else {
        if((part.mark === "+" || part.mark === "") && path.length === 0) {
            return;
        }
        if(part.mark === "+" || part.mark === "*") {
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

if(import.meta.vitest) {
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
        ])('part: "$part"', ({ part, empty, nonEmpty }) => {
            const partObject = parsePatternPart(part);
            it("空のpath", () => {
                expect(matchPart(partObject, [], {})).toEqual(empty);
            });
            it("空ではない任意のpath", () => {
                expect(matchPart(partObject, ["foo", "bar"], {})).toEqual(nonEmpty);
            });
        });
    });
}

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
        routes: Nomalize<RouteEntries<T, ParamKeys, R>>,
    ): Route<T, ParamKeys, R>;
    <T extends Routing<string, string>, R>(
        routes: Nomalize<RouteEntries<T["path"], T["paramKeys"], R>>,
    ): Route<T["path"], T["paramKeys"], R>
} = <T extends string, ParamKeys extends string, R>(
    routeRecord: Nomalize<RouteEntries<T, ParamKeys, R>>,
): Route<T, ParamKeys, R> => {
    const routeEntries = Object.keys(routeRecord).map(key => {
        const [part = "", ...restPattern] = parsePattern(key);
        const route = restPattern.reduceRight<Route<string, ParamKeys, R>>(
            (accum, part) => {
                const partString = typeof part === "string" ? part : ":" + part.key + part.mark;
                return routes({ [partString]: accum });
            },
            routeRecord[key as keyof typeof routeRecord] as Route<string, ParamKeys, R>,
        );
        return { part, route };
    });
    return {
        get(path, matchParams) {
            for(const { part, route } of routeEntries) {
                const partMatchResult = matchPart(part, path, matchParams);
                if(partMatchResult != null) {
                    const result = route.get(partMatchResult.path, partMatchResult.matchParams);
                    if(result !== null) {
                        return result;
                    }
                }
            }
            return null;
        }
    };
};

if(import.meta.vitest) {
    const { it, describe, expect } = import.meta.vitest;
    describe("routes", () => {
        it("空文字列キー", () => {
            const route = routes({ "": page(() => "page") });
            expect(route.get([], {})).toBe("page");
        });
        it("pattern part", () => {
            const route = routes({ "page": page(() => "page") });
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
    return {
        get(path, matchParams) {
            if(path.length !== 0) {
                return null;
            }
            return page(matchParams);
        },
    };
};

export const child = <T extends string, ParamKeys extends string, R>(
    child: (path: readonly string[], params: MatchParams<ParamKeys>) => R | null,
): Route<T, ParamKeys, R> => {
    return { get: child };
};

export type NomalizePath<T extends string> =
    T extends `${infer Pre}//${infer Post}` ? NomalizePath<`${Pre}/${Post}`>
    : T extends `/${infer U}` | `${infer U}/` ? NomalizePath<U>
    : T;

export interface Routing<out Path extends string, out ParamKeys extends string = never> {
    path: Path;
    paramKeys: ParamKeys;
}

type NestRoutes<
    T extends Record<string, Routing<string, string>>,
    K extends keyof T,
> = Routing<
    NomalizePath<
        K extends "" ? T[K]["path"]
        : K extends string ? `${K}/${T[K]["path"]}`
        : never
    >,
    K extends string
        ? T[K] extends Routing<string, infer ParamKeys>
            ? Exclude<ParamKeys, RemoveHead<K, ":">>
            : never
        : never
>;
export type Routes<T extends Record<string, Routing<string, string>>> = NestRoutes<T, Extract<keyof T, string>>;
export type Page<ParamKeys extends string = never> = Routing<"", ParamKeys>;

type GetPath<T extends string> =
    T extends `${infer U}/${infer Rest}` ? U | `${U}/${GetPath<Rest>}` : T;

export type GetRoute<T extends Routing<string, string>, P extends GetPath<T["path"]>> =
    T extends Routing<infer Path, infer ParamKeys>
        ? Routing<
            Path extends `${P}/${infer U}` ? U
            : Path extends P ? ""
            : never,
            ParamKeys | ParseStringPath<P>
        >
        : never;

// eslint-disable-next-line import/no-self-import
export * as Router from "./router";
