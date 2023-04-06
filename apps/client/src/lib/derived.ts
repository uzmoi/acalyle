import { noop } from "emnorst";
import { type ReadableAtom, type StoreValue, atom, onMount } from "nanostores";

export type PureAtom<T = unknown> = Pick<ReadableAtom<T>, "get" | "listen">;

export const pure = <T>(value: T): PureAtom<T> => ({
    get: () => value,
    listen: () => noop,
});

type AtomGet = <T>(atom: PureAtom<T>) => T;

// eslint-disable-next-line @typescript-eslint/ban-types
export const derived = <T extends PureAtom, Ext = {}>(
    derive: (get: AtomGet) => T,
): ReadableAtom<StoreValue<T>> & { current: T } & Ext => {
    const derived = atom<StoreValue<T> | undefined, { current: T } & Ext>();

    const subscriptions = new Map<PureAtom, () => void>();
    const run = () => {
        const nextSubscriptions = new Set<PureAtom>();
        const get: AtomGet = store => {
            if (!subscriptions.has(store)) {
                const unbind = store.listen(run);
                subscriptions.set(store, unbind);
            }
            nextSubscriptions.add(store);
            return store.get();
        };
        const derivedStore = derive(get);

        derived.current = derivedStore;
        derived.set(get(derivedStore) as StoreValue<T>);

        for (const [store, unbind] of subscriptions) {
            if (!nextSubscriptions.has(store)) {
                unbind();
                subscriptions.delete(store);
            }
        }
    };

    onMount(derived, () => {
        run();
        return () => {
            for (const [, unbind] of subscriptions) {
                unbind();
            }
            subscriptions.clear();
        };
    });

    return derived as ReadableAtom<StoreValue<T>> & { current: T } & Ext;
};
