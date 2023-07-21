import type { Normalize } from "emnorst";
import type { IdbObjectStoreSchema, IdbType } from "./types";
import { requestToPromise } from "./util";

type IdbValue<T extends IdbObjectStoreSchema> = Normalize<
    Record<Extract<T["keyPath"], string>, unknown>
>;

export type IdbQuery = IDBValidKey | IDBKeyRange;

type StoreType = Pick<IDBIndex, Extract<keyof IDBIndex, keyof IDBObjectStore>> &
    Pick<IDBObjectStore, Extract<keyof IDBObjectStore, keyof IDBIndex>>;

export abstract class IdbStore<
    S extends StoreType,
    T extends IdbObjectStoreSchema,
> implements IdbType<StoreType, "keyPath">
{
    constructor(protected readonly store: S) {}
    get name(): string {
        return this.store.name;
    }
    count(query?: IdbQuery): Promise<number> {
        const req = this.store.count(query);
        return requestToPromise(req);
    }
    get(query: IdbQuery): Promise<IdbValue<T> | undefined> {
        const req = this.store.get(query);
        return requestToPromise(req as IDBRequest<IdbValue<T> | undefined>);
    }
    getAll(query?: IdbQuery | null, count?: number): Promise<IdbValue<T>[]> {
        const req = this.store.getAll(query, count);
        return requestToPromise(req as IDBRequest<IdbValue<T>[]>);
    }
    getAllKeys(
        query?: IdbQuery | null,
        count?: number,
    ): Promise<IDBValidKey[]> {
        const req = this.store.getAllKeys(query, count);
        return requestToPromise(req);
    }
    getKey(query: IdbQuery): Promise<IDBValidKey | undefined> {
        const req = this.store.getKey(query);
        return requestToPromise(req);
    }
    openCursor(
        query?: IdbQuery | null,
        direction?: IDBCursorDirection,
    ): Promise<IDBCursorWithValue | null> {
        const req = this.store.openCursor(query, direction);
        return requestToPromise(req);
    }
    openKeyCursor(
        query?: IdbQuery | null,
        direction?: IDBCursorDirection,
    ): Promise<IDBCursor | null> {
        const req = this.store.openKeyCursor(query, direction);
        return requestToPromise(req);
    }
}

export class IdbObjectStore<T extends IdbObjectStoreSchema>
    extends IdbStore<IDBObjectStore, T>
    implements
        IdbType<
            IDBObjectStore,
            "createIndex" | "deleteIndex" | "index" | "transaction"
        >
{
    get autoIncrement(): boolean {
        return this.store.autoIncrement;
    }
    get keyPath(): string | string[] {
        return this.store.keyPath;
    }
    get indexNames(): (keyof T["indexes"])[] {
        return Array.from(this.store.indexNames) as (keyof T["indexes"])[];
    }
    index(name: keyof T["indexes"]): IdbIndex<T> {
        return new IdbIndex(this.store.index(name as string));
    }
    add(value: unknown, key?: IDBValidKey): Promise<IDBValidKey> {
        const req = this.store.add(value, key);
        return requestToPromise(req);
    }
    put(value: unknown, key?: IDBValidKey): Promise<IDBValidKey> {
        const req = this.store.put(value, key);
        return requestToPromise(req);
    }
    delete(query: IdbQuery): Promise<void> {
        const req = this.store.delete(query);
        return requestToPromise(req);
    }
    clear(): Promise<void> {
        const req = this.store.clear();
        return requestToPromise(req);
    }
}

export class IdbIndex<T extends IdbObjectStoreSchema>
    extends IdbStore<IDBIndex, T>
    implements IdbType<IDBIndex, "objectStore">
{
    get keyPath(): string | string[] {
        return this.store.keyPath;
    }
    get unique(): boolean {
        return this.store.unique;
    }
    get multiEntry(): boolean {
        return this.store.multiEntry;
    }
}
