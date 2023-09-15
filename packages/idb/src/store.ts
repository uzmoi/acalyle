import { IdbCursor } from "./cursor";
import type { IdbType } from "./types";
import { requestToPromise } from "./util";

export type IdbQuery = IDBValidKey | IDBKeyRange;

export abstract class IdbStore<
    out S extends IDBIndex | IDBObjectStore,
    out T,
    out Mode extends IDBTransactionMode,
> implements IdbType<IDBIndex | IDBObjectStore, "keyPath">
{
    constructor(protected readonly _store: S) {}
    get name(): string {
        return this._store.name;
    }
    get keyPath(): string | string[] {
        return this._store.keyPath;
    }
    count(query?: IdbQuery): Promise<number> {
        const req = this._store.count(query);
        return requestToPromise(req);
    }
    get(query: IdbQuery): Promise<T | undefined> {
        const req = this._store.get(query);
        return requestToPromise(req as IDBRequest<T | undefined>);
    }
    getAll(query?: IdbQuery | null, count?: number): Promise<T[]> {
        const req = this._store.getAll(query, count);
        return requestToPromise(req as IDBRequest<T[]>);
    }
    getAllKeys(
        query?: IdbQuery | null,
        count?: number,
    ): Promise<IDBValidKey[]> {
        const req = this._store.getAllKeys(query, count);
        return requestToPromise(req);
    }
    getKey(query: IdbQuery): Promise<IDBValidKey | undefined> {
        const req = this._store.getKey(query);
        return requestToPromise(req);
    }
    openCursor(
        query?: IdbQuery | null,
        direction?: IDBCursorDirection,
    ): Promise<IdbCursor<T, Mode> | null> {
        const req = this._store.openCursor(query, direction);
        return IdbCursor.from(req as IDBRequest<IDBCursor | null>);
    }
    openKeyCursor(
        query?: IdbQuery | null,
        direction?: IDBCursorDirection,
    ): Promise<IdbCursor<void, Mode> | null> {
        const req = this._store.openKeyCursor(query, direction);
        return IdbCursor.from(req);
    }
}

export class IdbObjectStore<
        T,
        Indexes extends string,
        out Mode extends IDBTransactionMode,
    >
    extends IdbStore<IDBObjectStore, T, Mode>
    implements IdbType<IDBObjectStore, "index" | "transaction">
{
    get autoIncrement(): boolean {
        return this._store.autoIncrement;
    }
    get indexNames(): Indexes[] {
        return Array.from(this._store.indexNames) as Indexes[];
    }
    createIndex(
        this: IdbObjectStore<T, Indexes, "versionchange">,
        name: string,
        keyPath: string | Iterable<string>,
        options?: IDBIndexParameters,
    ): IdbIndex<T, Mode> {
        return new IdbIndex(this._store.createIndex(name, keyPath, options));
    }
    deleteIndex(
        this: IdbObjectStore<T, Indexes, "versionchange">,
        name: string,
    ): void {
        this._store.deleteIndex(name);
    }
    index(name: Indexes): IdbIndex<T, Mode> {
        return new IdbIndex(this._store.index(name as string));
    }
    add(
        this: IdbObjectStore<T, Indexes, "readwrite">,
        value: T,
        key?: IDBValidKey,
    ): Promise<IDBValidKey> {
        const req = this._store.add(value, key);
        return requestToPromise(req);
    }
    put(
        this: IdbObjectStore<T, Indexes, "readwrite">,
        value: T,
        key?: IDBValidKey,
    ): Promise<IDBValidKey> {
        const req = this._store.put(value, key);
        return requestToPromise(req);
    }
    delete(
        this: IdbObjectStore<T, Indexes, "readwrite">,
        query: IdbQuery,
    ): Promise<void> {
        const req = this._store.delete(query);
        return requestToPromise(req);
    }
    clear(this: IdbObjectStore<T, Indexes, "readwrite">): Promise<void> {
        const req = this._store.clear();
        return requestToPromise(req);
    }
}

export class IdbIndex<T, out Mode extends IDBTransactionMode>
    extends IdbStore<IDBIndex, T, Mode>
    implements IdbType<IDBIndex, "objectStore">
{
    get unique(): boolean {
        return this._store.unique;
    }
    get multiEntry(): boolean {
        return this._store.multiEntry;
    }
}
