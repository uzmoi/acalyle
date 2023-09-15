import type { IdbCursor } from "./cursor";
import type { IdbObjectStoreSchema } from "./schema";
import type { IdbIndex } from "./store";
import type { IdbTransaction } from "./transaction";

type IDBRequestResult<T> = T extends IDBCursor
    ? IdbCursor<unknown, IDBTransactionMode>
    : Promise<unknown>;

type IDBResult<T> = T extends IDBRequest<infer U>
    ? IDBRequestResult<U>
    : T extends IDBTransaction
    ? IdbTransaction<Record<string, IdbObjectStoreSchema>, IDBTransactionMode>
    : T extends IDBIndex
    ? IdbIndex<unknown, IDBTransactionMode>
    : T;

export type IdbType<T, K> = {
    [P in Exclude<keyof T, K>]: T[P] extends (...args: infer A) => infer R
        ? (...args: A) => IDBResult<R>
        : unknown;
};
