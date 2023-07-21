import type { Callable } from "emnorst";

export type IdbType<T, K> = {
    [P in Exclude<keyof T, K>]: T[P] extends Callable
        ? T[P] extends (...args: infer A) => IDBRequest
            ? (...args: A) => Promise<unknown>
            : T[P]
        : unknown;
};

export interface IdbObjectStoreSchema extends IDBObjectStoreParameters {
    indexes?: Record<
        string,
        IDBIndexParameters & {
            keyPath: string | Iterable<string>;
        }
    >;
}
