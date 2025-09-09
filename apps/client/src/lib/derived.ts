import { type ReadableAtom, atom, onMount } from "nanostores";

export type PureAtom<T = unknown> = {
  listen?(listener: (value: T) => void): () => void;
  get(): T;
};

type AtomGet = <T>(atom: PureAtom<T>) => T;

export const derived = <T, Ext = {}>(
  derive: (get: AtomGet) => T,
): ReadableAtom<T> & Ext => {
  const derived = atom<T | undefined, Ext>();

  const subscriptions = new Map<PureAtom, () => void>();
  const run = (): void => {
    const nextSubscriptions = new Set<PureAtom>();
    const get: AtomGet = store => {
      if (store.listen && !subscriptions.has(store)) {
        const unbind = store.listen(run);
        subscriptions.set(store, unbind);
      }
      nextSubscriptions.add(store);
      return store.get();
    };

    derived.set(derive(get));

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
      for (const unbind of subscriptions.values()) {
        unbind();
      }
      subscriptions.clear();
    };
  });

  return derived as ReadableAtom<T> & Ext;
};
