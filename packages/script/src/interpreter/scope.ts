import type { SourceLocation } from "../parser";
import { RuntimeError } from "./meta-value";

export class ScopeError extends RuntimeError {
    constructor(
        readonly type: "defined" | "not-defined" | "readonly",
        readonly identName: string,
        loc: SourceLocation,
    ) {
        super(loc);
    }
}

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
        loc: SourceLocation,
    ): undefined | ScopeError {
        if (this._entries.has(name)) {
            return new ScopeError("defined", name, loc);
        }
        this._entries.set(name, entry);
    }
    get(name: string, loc: SourceLocation): T | ScopeError {
        const entry = this._entries.get(name);
        if (entry != null) {
            return entry.value;
        }
        if (this._parent != null) {
            return this._parent.get(name, loc);
        }
        return new ScopeError("not-defined", name, loc);
    }
    set(name: string, value: T, loc: SourceLocation): undefined | ScopeError {
        const entry = this._entries.get(name);
        if (entry == null) {
            return new ScopeError("not-defined", name, loc);
        }
        if (!entry.writable) {
            return new ScopeError("readonly", name, loc);
        }
        entry.value = value;
    }
}
