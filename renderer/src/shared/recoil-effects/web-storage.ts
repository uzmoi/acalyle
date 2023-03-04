import type { AtomEffect } from "recoil";

type Codec<T> = {
    encode: (value: T) => string;
    decode: (item: string) => T;
};

type WebStorageEffect = {
    (): AtomEffect<string>;
    <T>(codec: Codec<T>): AtomEffect<T>;
};

const webStorageEffect =
    (storage: Storage): WebStorageEffect =>
    <T>(codec?: Codec<T>): AtomEffect<T> =>
    ({ node, setSelf, onSet }) => {
        const storageKey = `recoil:${node.key}`;
        const initValue = storage.getItem(storageKey);
        if (initValue != null) {
            setSelf(codec ? codec.decode(initValue) : (initValue as T));
        }
        onSet(value => {
            storage.setItem(
                storageKey,
                codec ? codec.encode(value) : (value as string),
            );
        });
    };

export const localStorageEffect = webStorageEffect(localStorage);
export const sessionStorageEffect = webStorageEffect(sessionStorage);
