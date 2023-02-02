import { AtomEffect } from "recoil";

export const localStorageEffect =
    (key: string, defaultValue = ""): AtomEffect<string> =>
    ({ setSelf, onSet }) => {
        setSelf(localStorage.getItem(key) ?? defaultValue);
        onSet(value => {
            localStorage.setItem(key, value);
        });
    };

export const sessionStorageEffect =
    (key: string, defaultValue = ""): AtomEffect<string> =>
    ({ setSelf, onSet }) => {
        setSelf(sessionStorage.getItem(key) ?? defaultValue);
        onSet(value => {
            sessionStorage.setItem(key, value);
        });
    };
