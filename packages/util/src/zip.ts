import { identify } from "emnorst";

type UnknownArray = readonly unknown[];

export type Zip<T extends readonly UnknownArray[]> = {
    [P in keyof T]: T[P] extends readonly (infer U)[] ? U : never;
};

export const zipBy = <T extends readonly UnknownArray[] | [], Z>(
    arrays: T,
    zipper: (xs: Zip<T>) => Z,
    shouldEachEmpty?: boolean,
): Z[] => {
    const length = (shouldEachEmpty ? Math.max : Math.min)(
        ...arrays.map(xs => xs.length),
    );
    return Array.from({ length }, (_, i) =>
        zipper(arrays.map(xs => xs[i]) as Zip<T>),
    );
};

export const zip = <T extends readonly UnknownArray[] | []>(
    arrays: T,
    shouldEachEmpty?: boolean,
): Zip<T>[] => zipBy(arrays, identify, shouldEachEmpty);
