import { IdbTransaction } from "./transaction";
import type { IdbObjectStoreSchema, IdbType } from "./types";
import { requestToPromise } from "./util";

const upgrade = (
    db: IDBDatabase,
    schema: Record<string, IdbObjectStoreSchema>,
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

export class Idb<S extends Record<string, IdbObjectStoreSchema>>
    implements
        IdbType<
            IDBDatabase,
            | "transaction"
            | ("createObjectStore" | "deleteObjectStore")
            | (`on${string}` | keyof EventTarget)
        >
{
    static objectStore<const S extends IdbObjectStoreSchema>(
        objectStore: S,
    ): S {
        return objectStore;
    }
    static async open<const S extends Record<string, IdbObjectStoreSchema>>(
        name: string,
        version: number | undefined,
        schema: S,
    ): Promise<Idb<S>> {
        const req = indexedDB.open(name, version);

        req.addEventListener("upgradeneeded", () => {
            upgrade(req.result, schema);
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
    transaction<StoreName extends Extract<keyof S, string>>(
        storeNames: StoreName | Iterable<StoreName>,
        mode?: IDBTransactionMode,
        options?: IDBTransactionOptions,
    ): IdbTransaction<Pick<S, StoreName>> {
        const transaction = this.db.transaction(storeNames, mode, options);
        return new IdbTransaction(transaction);
    }
    close(): void {
        this.db.close();
    }
}
