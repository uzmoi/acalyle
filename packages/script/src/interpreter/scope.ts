import { Result } from "@acalyle/fp";

export type ScopeEntry<T> = {
    value: T;
    readonly writable: boolean;
};

export class Scope<T> {
    static create<T>(): Scope<T> {
        return new Scope(null);
    }
    private readonly _entries = new Map<string, ScopeEntry<T>>();
    private constructor(private readonly _parent: Scope<T> | null) {}
    child(): Scope<T> {
        return new Scope(this);
    }
    define(
        name: string,
        entry: ScopeEntry<T>,
    ): Result<void, { type: "defined"; name: string }> {
        if (this._entries.has(name)) {
            return Result.err({ type: "defined", name });
        }
        this._entries.set(name, entry);
        // eslint-disable-next-line unicorn/no-useless-undefined
        return Result.ok(undefined);
    }
    get(name: string): Result<T, { type: "not-defined"; name: string }> {
        const entry = this._entries.get(name);
        if (entry != null) {
            return Result.ok(entry.value);
        }
        if (this._parent != null) {
            return this._parent.get(name);
        }
        return Result.err({ type: "not-defined", name });
    }
    set(
        name: string,
        value: T,
    ): Result<void, { type: "not-defined" | "readonly"; name: string }> {
        const entry = this._entries.get(name);
        if (entry == null) {
            return Result.err({ type: "not-defined", name });
        }
        if (!entry.writable) {
            return Result.err({ type: "readonly", name });
        }
        entry.value = value;
        // eslint-disable-next-line unicorn/no-useless-undefined
        return Result.ok(undefined);
    }
}
