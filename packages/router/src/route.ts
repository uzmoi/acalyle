import type { Link, MatchParams } from "./pattern";

export class Route<
    in _Path extends string,
    out ParamKeys extends string,
    out R = unknown,
> {
    constructor(
        readonly get: (
            path: readonly string[],
            matchParams: MatchParams<ParamKeys>,
        ) => R | null,
    ) {}
}

// prettier-ignore
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
