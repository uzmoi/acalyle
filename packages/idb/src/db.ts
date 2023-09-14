import type { Normalize } from "emnorst";
import type { IdbObjectStoreSchema } from "./schema";
import { IdbTransaction } from "./transaction";
import type { IdbType } from "./types";
import { requestToPromise } from "./util";

const upgrade = (
    db: IDBDatabase,
    schema: Record<string, IdbObjectStoreSchemaObject>,
) => {
    for (const [name, options] of Object.entries(schema)) {
        const { keyPath, autoIncrement, indexes = {} as never } = options;
        const store = db.createObjectStore(name, {
            keyPath,
            autoIncrement,
        });
        for (const [name, { keyPath, unique, multiEntry }] of Object.entries(
            indexes,
        )) {
            store.createIndex(name, keyPath, { unique, multiEntry });
        }
    }
};

export interface IdbObjectStoreSchemaObject extends IDBObjectStoreParameters {
    indexes?: Record<
        string,
        IDBIndexParameters & {
            keyPath: string | Iterable<string>;
        }
    >;
}

type IdbValue<T extends IdbObjectStoreSchemaObject> = Normalize<
    Record<Extract<T["keyPath"], string>, IDBValidKey>
>;

export class Idb<S extends Record<string, IdbObjectStoreSchema>>
    implements
        IdbType<
            IDBDatabase,
            | "transaction"
            | ("createObjectStore" | "deleteObjectStore")
            | (`on${string}` | keyof EventTarget)
        >
{
    static objectStore<const S extends IdbObjectStoreSchemaObject>(
        objectStore: S,
    ): IdbObjectStoreSchema<IdbValue<S>, NonNullable<S["indexes"]>> {
        return objectStore as never;
    }
    static async open<const S extends Record<string, IdbObjectStoreSchema>>(
        name: string,
        version: number | undefined,
        schema: S,
    ): Promise<Idb<S>> {
        const req = indexedDB.open(name, version);

        req.addEventListener("upgradeneeded", () => {
            upgrade(
                req.result,
                schema as Record<string, IdbObjectStoreSchemaObject>,
            );
        });

        const db = await requestToPromise(req);
        return new Idb(db);
    }
    private constructor(private readonly db: IDBDatabase) {}
    get name(): string {
        return this.db.name;
    }
    get version(): number {
        return this.db.version;
    }
    get objectStoreNames(): (keyof S)[] {
        return Array.from(this.db.objectStoreNames);
    }
    transaction<
        StoreName extends Extract<keyof S, string>,
        Mode extends Exclude<IDBTransactionMode, "versionchange"> = "readonly",
    >(
        storeNames: StoreName | Iterable<StoreName>,
        mode?: Mode,
        options?: IDBTransactionOptions,
    ): IdbTransaction<Normalize<Pick<S, StoreName>>, Mode> {
        const transaction = this.db.transaction(storeNames, mode, options);
        return new IdbTransaction(transaction);
    }
    close(): void {
        this.db.close();
    }
}
