import { AtomEffect } from "recoil";

const webStorageEffect =
    (storage: Storage) =>
    (): AtomEffect<string> =>
    ({ node, setSelf, onSet }) => {
        const storageKey = `recoil:${node.key}`;
        const initValue = storage.getItem(storageKey);
        if (initValue != null) {
            setSelf(initValue);
        }
        onSet(value => {
            storage.setItem(storageKey, value);
        });
    };

export const localStorageEffect = webStorageEffect(localStorage);
export const sessionStorageEffect = webStorageEffect(sessionStorage);
