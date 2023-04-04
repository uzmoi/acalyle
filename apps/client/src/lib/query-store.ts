import { atom, onMount } from "nanostores";
import { memoizeBuilder } from "~/lib/memoize-builder";

export const createQueryStore = <T>(fetch: (id: string) => Promise<T>) => {
    return memoizeBuilder((memoized, id: string) => {
        const storeAtom = atom<T | null>(null);

        onMount(storeAtom, () => {
            if (storeAtom.get() == null) {
                void fetch(id).then(value => {
                    storeAtom.set(value);
                });
            }
            return () => {
                delete memoized.cache[id];
            };
        });

        return storeAtom;
    });
};
