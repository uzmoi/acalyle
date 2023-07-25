import type { Normalize } from "emnorst";
import type { IdbObjectStoreSchema, IdbType } from "./types";
import { requestToPromise } from "./util";

type IdbValue<T extends IdbObjectStoreSchema> = Normalize<
    Record<Extract<T["keyPath"], string>, IDBValidKey>
>;

export type IdbQuery = IDBValidKey | IDBKeyRange;

export abstract class IdbStore<S extends IDBIndex | IDBObjectStore, T>
    implements IdbType<IDBIndex | IDBObjectStore, "keyPath">
{
    constructor(protected readonly store: S) {}
    get name(): string {
        return this.store.name;
    }
    count(query?: IdbQuery): Promise<number> {
        const req = this.store.count(query);
        return requestToPromise(req);
    }
    get(query: IdbQuery): Promise<T | undefined> {
        const req = this.store.get(query);
        return requestToPromise(req as IDBRequest<T | undefined>);
    }
    getAll(query?: IdbQuery | null, count?: number): Promise<T[]> {
        const req = this.store.getAll(query, count);
        return requestToPromise(req as IDBRequest<T[]>);
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

export class IdbObjectStore<
        T extends IdbObjectStoreSchema,
        out _Mode extends IDBTransactionMode,
    >
    extends IdbStore<IDBObjectStore, IdbValue<T>>
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
    createIndex(
        this: IdbObjectStore<T, "versionchange">,
        name: string,
        keyPath: string | Iterable<string>,
        options?: IDBIndexParameters,
    ): IdbIndex<T> {
        return new IdbIndex(this.store.createIndex(name, keyPath, options));
    }
    deleteIndex(this: IdbObjectStore<T, "versionchange">, name: string): void {
        this.store.deleteIndex(name);
    }
    index(name: keyof T["indexes"]): IdbIndex<T> {
        return new IdbIndex(this.store.index(name as string));
    }
    add(
        this: IdbObjectStore<T, "readwrite">,
        value: IdbValue<T>,
        key?: IDBValidKey,
    ): Promise<IDBValidKey> {
        const req = this.store.add(value, key);
        return requestToPromise(req);
    }
    put(
        this: IdbObjectStore<T, "readwrite">,
        value: IdbValue<T>,
        key?: IDBValidKey,
    ): Promise<IDBValidKey> {
        const req = this.store.put(value, key);
        return requestToPromise(req);
    }
    delete(
        this: IdbObjectStore<T, "readwrite">,
        query: IdbQuery,
    ): Promise<void> {
        const req = this.store.delete(query);
        return requestToPromise(req);
    }
    clear(this: IdbObjectStore<T, "readwrite">): Promise<void> {
        const req = this.store.clear();
        return requestToPromise(req);
    }
}

export class IdbIndex<T extends IdbObjectStoreSchema>
    extends IdbStore<IDBIndex, IdbValue<T>>
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
