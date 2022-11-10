import type { MatchParamKeyOf, NormalizePath } from "./pattern";
import type { RemoveHead } from "./util";

export interface Routing<
    out Path extends string,
    out ParamKeys extends string = never,
> {
    path: Path;
    paramKeys: ParamKeys;
}

// prettier-ignore
type NestRoutes<
    T extends Record<string, Routing<string, string>>,
    K extends keyof T,
> = Routing<
    NormalizePath<K extends string ? `${K}/${T[K]["path"]}` : never>,
    K extends string
        ? T[K] extends Routing<string, infer ParamKeys>
            ? Exclude<ParamKeys, RemoveHead<K, ":">>
            : never
        : never
>;

export type Routes<T extends Record<string, Routing<string, string>>> =
    NestRoutes<T, Extract<keyof T, string>>;

export type Page<ParamKeys extends string = never> = Routing<"", ParamKeys>;

// prettier-ignore
type GetPath<T extends string> =
    T extends `${infer U}/${infer Rest}` ? U | `${U}/${GetPath<Rest>}` : T;

// prettier-ignore
export type GetRoute<T extends Routing<string, string>, P extends GetPath<T["path"]>> =
    T extends Routing<infer Path, infer ParamKeys>
        ? Routing<
            Path extends `${P}/${infer U}` ? U
            : Path extends P ? ""
            : never,
            ParamKeys | MatchParamKeyOf<P>
        >
        : never;
