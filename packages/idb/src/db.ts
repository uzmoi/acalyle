import type { Normalize } from "emnorst";
import { IdbObjectStoreSchema, IdbSchema, type IdbSchemaType } from "./schema";
import { IdbTransaction } from "./transaction";
import type { IdbType } from "./types";
import { onceAll, requestToPromise } from "./util";

export class Idb<S extends Record<string, IdbObjectStoreSchema>>
    implements
        IdbType<
            IDBDatabase,
            | "transaction"
            | ("createObjectStore" | "deleteObjectStore")
            | (`on${string}` | keyof EventTarget)
        >
{
    static async open<S extends IdbSchema>(
        schema: S,
    ): Promise<Idb<IdbSchemaType<S>>> {
        const req = indexedDB.open(schema.name, schema.version);

        req.addEventListener("upgradeneeded", () => {
            schema.upgrade(req.result);
        });

        const db = await requestToPromise(req);
        return new Idb(db);
    }
    private constructor(private readonly db: IDBDatabase) {}
    private _whenClose = new Promise((resolve, reject) => {
        onceAll(this.db, { close: resolve, abort: reject });
    });
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
    whenClose(): Promise<void> {
        return this._whenClose as Promise<void>;
    }
}
