import { onMount } from "nanostores";
import { memoizeBuilder } from "~/lib/memoize-builder";
import { createPromiseLoaderAtom } from "~/lib/promise-loader";

export const createQueryStore = <T, A extends readonly unknown[]>(
    fetch: (...args: A) => Promise<T>,
    hash?: (...args: A) => string,
) => {
    return memoizeBuilder((_, ...args) => {
        const storeAtom = createPromiseLoaderAtom<T>();

        onMount(storeAtom, () => {
            if (storeAtom.get().status === "unpending") {
                storeAtom.pending(fetch(...args));
            }
        });

        return storeAtom;
    }, hash);
};
