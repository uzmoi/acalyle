import { Meta, Nomalize } from "emnorst";

type RemoveHead<S extends string, Head extends string> = S extends `${Head}${infer P}` ? P : S;
type RemoveTail<S extends string, Tail extends string> = S extends `${infer P}${Tail}` ? P : S;

type Mark = "+" | "*" | "?";

export type MatchParams<in T extends string> = {
    [P in T as RemoveTail<P, Mark>]:
        P extends `${string}+` ? [string, ...string[]]
        : P extends `${string}*` ? string[]
        : P extends `${string}?` ? string | undefined
        : string;
};

type ParamKey<T extends string> = T extends `:${infer U}` ? U : never;

export type ParseStringPath<T extends string> = T extends `${infer U}/${infer Rest}`
    ? ParamKey<U> | ParseStringPath<Rest>
    : ParamKey<T>;

type Part = string | { key: string, mark: Mark | "" }

const parsePatternPart = (part: string): Part => {
    const match = /^:(\w*)([+*?]?)/.exec(part);
    return match == null ? part
        : { key: match[1], mark: match[2] as Mark | "" };
};

const parsePattern = (pattern: string): Part[] =>
    pattern.split("/").filter(Boolean).map(parsePatternPart);

export type Link<T extends string = string> =  Meta<string, `link:${T}`>;

export interface LinkBuilder<in T extends string> {
    <U extends T>(pattern: U, params: MatchParams<ParseStringPath<U>>): Link<U>;
    <U extends T>(
        pattern: U,
        ...args: U extends `${string}/:${string}` | `:${string}`
            ? [params: MatchParams<ParseStringPath<U>>] : []
    ): Link<U>;
}

export interface Route<in Path extends string, out ParamKeys extends string, out R = unknown> {
    get(path: string[], matchParams: MatchParams<ParamKeys>): R | null;
}

export const match: <Path extends string, ParamKeys extends string, R>(
    route: Route<Path, ParamKeys, R>,
    link: Link<Path>,
    ...args: [ParamKeys] extends [never]
        ? [] : [matchParams: MatchParams<ParamKeys>]
) => R | null = <Path extends string, ParamKeys extends string, R>(
    route: Route<Path, ParamKeys, R>,
    link: Link<Path>,
    matchParams: MatchParams<ParamKeys> = {} as never,
): R | null => {
    const path = link.split("/").filter(Boolean);
    return route.get(path, matchParams);
};

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
        const pattern = parsePattern(key);
        return {
            part: pattern.shift() ?? "",
            route: pattern.reduceRight<Route<string, ParamKeys, R>>(
                (accum, part) => routes({
                    [typeof part === "string" ? part : ":" + part.key + part.mark]: accum,
                }),
                routeRecord[key as keyof typeof routeRecord] as Route<string, ParamKeys, R>,
            ),
        };
    });
    return {
        get(path, matchParams) {
            for(const { part, route } of routeEntries) {
                const path$ = [...path];
                const matchParams$ = { ...matchParams };
                if(typeof part === "string") {
                    if(part !== "" && path$.shift() !== part) {
                        continue;
                    }
                } else {
                    if((part.mark === "+" || part.mark === "") && path$.length === 0) {
                        continue;
                    }
                    matchParams$[part.key as never] = part.mark === "+" || part.mark === "*"
                        ? path$ as never : path$.shift() as never;
                }
                const result = route.get(path$, matchParams$);
                if(result !== null) {
                    return result;
                }
            }
            return null;
        }
    };
};

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

// eslint-disable-next-line import/no-self-import
export * as Router from "./router";

if(import.meta.vitest) {
    const { vi, it, expect } = import.meta.vitest;
    const link_ = link();
    it("link", () => {
        expect(link_("")).toBe("");
        expect(link_("hoge")).toBe("hoge");
        expect(link_("/a///b")).toBe("a/b");
        expect(link_("normal/://:option?/:many*/", {
            "": "any",
            option: undefined,
            many: ["a", "b"],
        })).toBe("normal/any/a/b");
    });
    it("constructor", () => {
        const route = routes({
            hoge: child(vi.fn()),
            ":fuga": child(vi.fn()),
            "piyo/piyoyo": child(vi.fn()),
        });
        expect(route.get(["hoge"], {})).toBeUndefined();
        expect(route.get(["fugafuga"], {})).toBeUndefined();
        expect(route.get(["piyo/piyoyo"], {})).toBeUndefined();
    });
    it("match path", () => {
        type P = Routing<string, never>;
        type R = MatchParams<never>;
        const $page = page<never, R>(params => params);
        expect(match($page, link_(""))).toEqual({});
        expect(match(routes<P, R>({ "": $page }), link_(""))).toEqual({});
        expect(match(routes<P, R>({ hoge: $page }), link_("hoge"))).toEqual({});
    });
}
