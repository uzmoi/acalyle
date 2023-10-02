import type { NonUnion } from "emnorst";

export type IdbValue<T extends IdbObjectStoreSchema> =
    T extends IdbObjectStoreSchema<infer U, infer _> ? U : never;

export type IdbIndexes<T extends IdbObjectStoreSchema> =
    T extends IdbObjectStoreSchema<infer _, infer U> ? U : never;

export class IdbObjectStoreSchema<
    out Value = unknown,
    out Indexes extends string = string,
> {
    private _indexes = new Map<
        string,
        IDBIndexParameters & {
            keyPath: string | Iterable<string>;
        }
    >();
    constructor(private readonly _options?: IDBObjectStoreParameters) {}
    index<I extends string>(
        name: NonUnion<I>,
        keyPath: string | Iterable<string>,
        options?: IDBIndexParameters,
    ): IdbObjectStoreSchema<Value, Indexes | I> {
        this._indexes.set(name, { ...options, keyPath });
        return this;
    }
    create(db: IDBDatabase, name: string): IDBObjectStore {
        const store = db.createObjectStore(name, this._options);

        for (const [name, { keyPath, ...options }] of this._indexes) {
            store.createIndex(name, keyPath, options);
        }

        return store;
    }
}

export type IdbSchemaType<T extends IdbSchema> = T extends IdbSchema<infer U>
    ? U
    : never;

export class IdbSchema<T extends Record<string, IdbObjectStoreSchema> = {}> {
    static objectStore<T>(
        options?: IDBObjectStoreParameters,
    ): IdbObjectStoreSchema<T, never> {
        return new IdbObjectStoreSchema(options);
    }
    constructor(
        readonly name: string,
        readonly version: number,
        private readonly _stores: T,
    ) {}
    upgrade(db: IDBDatabase) {
        for (const [name, options] of Object.entries(this._stores)) {
            options.create(db, name);
        }
    }
}
