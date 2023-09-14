// eslint-disable-next-line @typescript-eslint/ban-types
type EmptyObject = {};

export type IdbObjectStoreSchema<
    out Value = unknown,
    out Indexes extends Record<string, IDBIndexParameters> = EmptyObject,
> = {
    phantomType: true;

    Value: Value;
    Indexes: Indexes;
};

export type IdbValue<T extends IdbObjectStoreSchema> =
    T extends IdbObjectStoreSchema<infer U, infer _> ? U : never;

export type IdbIndexes<T extends IdbObjectStoreSchema> =
    T extends IdbObjectStoreSchema<infer _, infer U>
        ? Extract<keyof U, string>
        : never;
