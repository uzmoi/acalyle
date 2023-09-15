import type { NonUnion } from "emnorst";
import type { IdbIndexes, IdbObjectStoreSchema, IdbValue } from "./schema";
import { IdbObjectStore } from "./store";
import type { IdbType } from "./types";
import { onAll } from "./util";

export class IdbTransaction<
    S extends Record<string, IdbObjectStoreSchema>,
    out Mode extends IDBTransactionMode,
> implements
        IdbType<
            IDBTransaction,
            "objectStore" | "error" | "db" | `on${string}` | keyof EventTarget
        >
{
    constructor(private readonly tx: IDBTransaction) {}
    private _whenComplete = new Promise<void>((resolve, reject) => {
        const offAll = onAll(this.tx, {
            complete() {
                resolve();
                offAll();
            },
            abort() {
                reject(this.error);
                offAll();
            },
        });
    });
    get durability(): IDBTransactionDurability {
        return this.tx.durability;
    }
    get mode(): Mode {
        return this.tx.mode as Mode;
    }
    get objectStoreNames(): (keyof S)[] {
        return Array.from(this.tx.objectStoreNames);
    }
    abort() {
        this.tx.abort();
    }
    commit() {
        this.tx.commit();
    }
    whenComplete(): Promise<void> {
        return this._whenComplete;
    }
    objectStore<StoreName extends Extract<keyof S, string>>(
        name: NonUnion<StoreName>,
    ): IdbObjectStore<IdbValue<S[StoreName]>, IdbIndexes<S[StoreName]>, Mode> {
        return new IdbObjectStore(this.tx.objectStore(name));
    }
}
