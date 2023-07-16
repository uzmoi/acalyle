import type { ValueOf } from "emnorst";
import {
    type Mark,
    type MatchParams,
    type ParamRecord,
    type PatternPart,
    parsePattern,
} from "./pattern";
import { type Path, Route } from "./route";

type MatchResult<T extends string> =
    | { path: Path<string>; matchParams: MatchParams<T> }
    | undefined;

/** @private */
export const matchPart = <T extends string>(
    part: PatternPart,
    path: Path<string>,
    matchParams: MatchParams<T>,
): MatchResult<T> => {
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

const matchParts = <T extends string>(
    parts: readonly PatternPart[],
    path: Path<string>,
    matchParams: MatchParams<T>,
): MatchResult<T> => {
    for (const part of parts) {
        const partMatchResult = matchPart(part, path, matchParams);
        if (partMatchResult == null) return;
        ({ path, matchParams } = partMatchResult);
    }
    return { path, matchParams };
};

type RoutesPath<T> = {
    [P in keyof T]: T[P] extends Route<infer Path, infer _, infer __>
        ? `${P & string}/${Path}`
        : never;
}[keyof T];

type ParamKey<T> = T extends `:${infer U}${Mark | ""}` ? U : never;

type RoutesParams<T> = {
    [P in keyof T]: T[P] extends Route<never, infer Params, unknown>
        ? Omit<Params, ParamKey<P>>
        : never;
}[keyof T];

type RoutesReturn<T> = ValueOf<T> extends Route<string, string, infer R>
    ? R
    : never;

type Routes<T> = Route<RoutesPath<T>, RoutesParams<T>, RoutesReturn<T>>;

export const routes = <const T extends { [x: string]: Route<never> }>(
    routeRecord: T,
): Routes<T> => {
    const routeEntries = Object.entries(routeRecord).map(([pattern, route]) => {
        return { parts: parsePattern(pattern).parts, route };
    });
    return new Route((path, matchParams) => {
        for (const { parts, route } of routeEntries) {
            const matchResult = matchParts(
                parts,
                path,
                matchParams as MatchParams<string>,
            );
            if (matchResult != null) {
                const result = route.get(
                    matchResult.path,
                    matchResult.matchParams as never,
                );
                if (result !== null) {
                    return result as never;
                }
            }
        }
        return null as never;
    });
};

export const page = <Params, R = unknown>(
    page: (params: Params) => R,
): Route<"", Params, R> => {
    return new Route((path, matchParams) => {
        if (path.length !== 0) {
            return null;
        }
        return page(matchParams);
    });
};

export const child = <T extends string, Params extends ParamRecord, R>(
    child: (path: Path<T>, params: Params) => R | null,
): Route<T, Params, R> => {
    return new Route(child);
};
