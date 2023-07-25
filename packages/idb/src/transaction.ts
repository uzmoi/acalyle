import type { NonUnion } from "emnorst";
import { IdbObjectStore } from "./store";
import type { IdbObjectStoreSchema, IdbType } from "./types";

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
    objectStore<StoreName extends Extract<keyof S, string>>(
        name: NonUnion<StoreName>,
    ): IdbObjectStore<S[StoreName], Mode> {
        return new IdbObjectStore(this.tx.objectStore(name));
    }
}