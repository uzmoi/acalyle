export interface MemoizedBuilder<T, A extends readonly unknown[] = []> {
    (id: string, ...args: A): T;
    build(this: this, store: this, id: string, ...args: A): T;
    cache: Record<string, T>;
}

export const memoizeBuilder = <T, A extends readonly unknown[] | [] = []>(
    build: (
        this: MemoizedBuilder<T, A>,
        store: MemoizedBuilder<T, A>,
        id: string,
        ...args: A
    ) => T,
): MemoizedBuilder<T, A> => {
    const store = (id: string, ...args: A) => {
        if (!store.cache[id]) {
            store.cache[id] = store.build(store, id, ...args);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return store.cache[id]!;
    };

    store.build = build;

    store.cache = {} as Record<string, T>;

    return store;
};
