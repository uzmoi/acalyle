import { identify } from "emnorst";

type UnknownArray = readonly unknown[];

type Fill<T, U> = {
    -readonly [_ in keyof T]: U;
};

export type ZipEntry<
    T extends readonly UnknownArray[],
    AllowMissing extends boolean,
> = Zip<T, AllowMissing>[number];

export type ZipBy<
    T extends readonly UnknownArray[],
    Z,
    AllowMissing extends boolean,
> = Fill<ZipBase<T[number], AllowMissing>, Z>;

export const zipBy = <
    T extends readonly UnknownArray[] | [],
    Z,
    const AllowMissing extends boolean = false,
>(
    arrays: T,
    zipper: (xs: ZipEntry<T, AllowMissing>) => Z,
    allowMissing?: AllowMissing,
): ZipBy<T, Z, AllowMissing> => {
    const length = (allowMissing ? Math.max : Math.min)(
        ...arrays.map(xs => xs.length),
    );
    return Array.from({ length }, (_, i) =>
        zipper(arrays.map(xs => xs[i]) as ZipEntry<T, AllowMissing>),
    ) as ZipBy<T, Z, AllowMissing>;
};

export type Zip<
    T extends readonly UnknownArray[],
    AllowMissing extends boolean,
> = ZipInternal<ZipBase<T[number], AllowMissing>, T, AllowMissing>;

export const zip = <
    T extends readonly UnknownArray[] | [],
    const AllowMissing extends boolean = false,
>(
    arrays: T,
    allowMissing?: AllowMissing,
): Zip<T, AllowMissing> =>
    zipBy(arrays, identify, allowMissing) as Zip<T, AllowMissing>;

// Internal types

type ZipInternal<
    Base,
    T extends readonly UnknownArray[],
    AllowMissing extends boolean,
> = {
    -readonly [P in keyof Base]: Zip1<T, P, AllowMissing>;
};

type TupleIndexAccessUndefined<
    K,
    T,
    AllowMissing extends boolean,
> = number extends K
    ? number extends T
        ? never
        : AllowMissing extends true
        ? undefined
        : never
    : never;

type Zip1<
    T extends readonly UnknownArray[],
    K,
    AllowMissing extends boolean,
> = {
    -readonly [P in keyof T]: K extends keyof T[P]
        ? T[P][K] | TupleIndexAccessUndefined<K, T[P]["length"], AllowMissing>
        : undefined;
};

// ZipBase

type ZipBase<
    T extends readonly unknown[],
    AllowMissing extends boolean,
> = AllowMissing extends true ? Max<T> : Min<T>;

type NonMin<
    T extends readonly unknown[],
    A extends readonly unknown[] = T,
> = T extends unknown
    ? A extends unknown
        ? T["length"] extends Partial<A>["length"]
            ? never
            : T
        : never
    : never;

type Just<in out T> = ($in: T) => T;

type Min<
    T extends readonly unknown[],
    A = NonMin<T>,
> = number extends T["length"]
    ? T[number][]
    : T extends unknown
    ? Just<T> extends Just<A>
        ? never
        : T
    : never;

type Max<
    T extends readonly unknown[],
    A = Partial<T>["length"],
> = number extends T["length"]
    ? T[number][]
    : T extends readonly unknown[]
    ? [A] extends [Partial<T>["length"]]
        ? T
        : never
    : never;
