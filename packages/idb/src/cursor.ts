import type { IdbType } from "./types";
import { requestToPromise } from "./util";

export class IdbCursor<out T, out Mode extends IDBTransactionMode>
    implements IdbType<IDBCursorWithValue, "request" | "source">
{
    static async from<T, Mode extends IDBTransactionMode>(
        request: IDBRequest<IDBCursor | null>,
    ): Promise<IdbCursor<T, Mode> | null> {
        const cursor = await requestToPromise(request);
        return cursor && new IdbCursor(cursor);
    }
    private constructor(private readonly cursor: IDBCursor) {}
    get value(): T {
        return (this.cursor as IDBCursorWithValue).value as T;
    }
    get direction(): IDBCursorDirection {
        return this.cursor.direction;
    }
    get key(): IDBValidKey {
        return this.cursor.key;
    }
    get primaryKey(): IDBValidKey {
        return this.cursor.primaryKey;
    }
    async advance(count: number): Promise<IdbCursor<T, Mode> | null> {
        this.cursor.advance(count);
        return IdbCursor.from(
            this.cursor.request as IDBRequest<IDBCursor | null>,
        );
    }
    async continue(key?: IDBValidKey): Promise<IdbCursor<T, Mode> | null> {
        this.cursor.continue(key);
        return IdbCursor.from(
            this.cursor.request as IDBRequest<IDBCursor | null>,
        );
    }
    async continuePrimaryKey(
        key: IDBValidKey,
        primaryKey: IDBValidKey,
    ): Promise<IdbCursor<T, Mode> | null> {
        this.cursor.continuePrimaryKey(key, primaryKey);
        return IdbCursor.from(
            this.cursor.request as IDBRequest<IDBCursor | null>,
        );
    }
    delete(this: IdbCursor<T, "readwrite">): Promise<void> {
        const req = this.cursor.delete();
        return requestToPromise(req);
    }
    update(this: IdbCursor<T, "readwrite">, value: T): Promise<IDBValidKey> {
        const req = this.cursor.update(value);
        return requestToPromise(req);
    }
}
