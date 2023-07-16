import type { WeakMeta } from "emnorst";
import type { Link, NormalizePath, ParamRecord } from "./pattern";

export type Path<T> = WeakMeta<readonly string[], { path: T }>;

export type InferPath<T> = T extends Route<infer P, infer _, infer __>
    ? NormalizePath<P>
    : never;

export class Route<in P extends string, in Params = never, out R = unknown> {
    constructor(
        readonly get: (path: Path<P>, matchParams: Params) => R | null,
    ) {}
}

// prettier-ignore
export const match: <Path extends string, Params extends ParamRecord, R>(
    route: Route<Path, Params, R>,
    link: Link<Path>,
    ...args: [keyof Params] extends [never]
        ? [] : [params: Params]
) => R | null = <Path extends string, Params extends ParamRecord, R>(
    route: Route<Path, Params, R>,
    link: Link<Path>,
    params: Params = {} as never,
): R | null => {
    const path = link.split("/").filter(Boolean);
    return route.get(path, params);
};
