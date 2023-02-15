import type { Normalize } from "emnorst";
import { type MatchParams, type PatternPart, parsePattern } from "./pattern";
import { Route } from "./route";
import type { Routing } from "./types";
import type { RemoveTail } from "./util";

/** @private */
export const matchPart = <T extends string>(
    part: PatternPart,
    path: readonly string[],
    matchParams: MatchParams<T>,
): { path: readonly string[]; matchParams: MatchParams<T> } | undefined => {
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
