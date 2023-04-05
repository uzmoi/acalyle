import { onMount } from "nanostores";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { createPromiseLoaderAtom } from "~/lib/promise-loader";

export const createQueryStore = <T>(fetch: (id: string) => Promise<T>) => {
    return memoizeBuilder((_, id: string) => {
        const storeAtom = createPromiseLoaderAtom<T>();

        onMount(storeAtom, () => {
            if (storeAtom.get().status === "unpending") {
                storeAtom.pending(fetch(id));
            }
        });

        return storeAtom;
    });
};
