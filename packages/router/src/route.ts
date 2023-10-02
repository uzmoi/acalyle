import type { WeakMeta } from "emnorst";
import type { Link, NormalizePath, ParamRecord } from "./pattern";

export type Path<T> = WeakMeta<readonly string[], { path: T }>;

export type InferPath<T> = T extends Route<infer P, infer _, infer __>
    ? NormalizePath<P>
    : never;

// HACK: 同じ関数の交差型で何故か、メソッドの引数の変性のチェックを誤魔化せる。
type Hack<T extends (...args: never[]) => unknown> = T &
    ((...args: Parameters<T>) => ReturnType<T>);

export class Route<
    in P extends string,
    in Params extends {} = never,
    out R = unknown,
> {
    constructor(readonly get: (path: Path<P>, matchParams: Params) => R) {}
    // HACK: Paramsの変性のチェックを誤魔化す。
    default<R2>(
        f: Hack<(path: Path<P>, matchParams: Params) => R2>,
    ): Route<P, Params, (R & ({} | null)) | R2> {
        return new Route((path, matchParams) => {
            const result = this.get(path, matchParams);
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            return result === undefined ? f(path, matchParams) : result;
        });
    }
    // HACK: Paramsの変性のチェックを誤魔化す。
    map<R2>(
        f: Hack<
            (result: R & ({} | null), path: Path<P>, matchParams: Params) => R2
        >,
    ): Route<P, Params, R2 | (R & undefined)> {
        return new Route((path, matchParams) => {
            const result = this.get(path, matchParams);
            if (result === undefined) return undefined as R & undefined;
            return f(result, path, matchParams);
        });
    }
}

// prettier-ignore
export const match: <Path extends string, Params extends ParamRecord, R>(
    route: Route<Path, Params, R>,
    link: Link<Path>,
    ...args: [keyof Params] extends [never]
        ? [] : [params: Params]
) => R = <Path extends string, Params extends ParamRecord, R>(
    route: Route<Path, Params, R>,
    link: Link<Path>,
    params: Params = {} as never,
): R  => {
    const path = link.split("/").filter(Boolean);
    return route.get(path, params);
};
