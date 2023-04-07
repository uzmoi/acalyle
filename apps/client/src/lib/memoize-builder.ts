export type MemoizedBuilder<T, A extends readonly unknown[] = []> = {
    (...args: A): T;
    build(id: string, ...args: A): T;
    readonly cache: Map<string, T>;
};

export const memoizeBuilder = <T, A extends readonly unknown[] | [] = []>(
    build: (id: string, ...args: A) => T,
    hash: (...args: A) => string = (...args) => args.join(),
): MemoizedBuilder<T, A> => {
    const store = (...args: A) => {
        const id = hash(...args);
        if (!store.cache.has(id)) {
            store.cache.set(id, store.build(id, ...args));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return store.cache.get(id)!;
    };

    store.build = build;

    store.cache = new Map<string, T>();

    return store;
};
