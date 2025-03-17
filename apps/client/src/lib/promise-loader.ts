import { type Atom, type StoreValue, atom } from "nanostores";

export type PromiseLoader<T = unknown> =
    | { status: "pending"; promise: PromiseLike<void>; abort?: () => void }
    | { status: "fulfilled"; value: T }
    | { status: "rejected"; error: unknown };

export type PromiseLoaderW<T = unknown> =
    | PromiseLoader<T>
    | { status: "unpending" };

export const toPromise = async <T>(
    store: Atom<PromiseLoaderW<T>>,
): Promise<T> => {
    const loader = store.get();

    switch (loader.status) {
        case "unpending": {
            throw new Error("Unpending");
        }
        case "pending": {
            await loader.promise;
            return toPromise(store);
        }
        case "fulfilled": {
            return loader.value;
        }
        case "rejected": {
            throw loader.error;
        }
    }
};

export const usePromiseLoader = <T>(loader: PromiseLoaderW<T>): T => {
    switch (loader.status) {
        case "unpending": {
            throw new Error("Unpending");
        }
        case "pending": {
            throw loader.promise;
        }
        case "fulfilled": {
            return loader.value;
        }
        case "rejected": {
            throw loader.error;
        }
    }
};

declare const T: unique symbol;

export interface PromiseLoaderExt {
    [T]: Extract<StoreValue<this>, { status: "fulfilled" }>["value"];
    pending(
        this: void,
        promise: PromiseLike<this[typeof T]>,
        abort?: () => void,
    ): void;
    resolve(this: void, value: this[typeof T]): void;
    reject(this: void, error: unknown): void;
}

export const createPromiseLoaderAtom = <T>() => {
    const store = atom<PromiseLoaderW<T>, PromiseLoaderExt>({
        status: "unpending",
    });

    store.pending = (promise, abort) => {
        store.set({
            status: "pending",
            promise: promise.then(store.resolve, store.reject),
            abort,
        });
    };
    store.resolve = value => {
        store.set({ status: "fulfilled", value });
    };
    store.reject = error => {
        store.set({ status: "rejected", error });
    };

    return store;
};
