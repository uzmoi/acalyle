import { timeout } from "emnorst";

export const debounce = <T extends readonly unknown[]>(
    f: (...args: T) => void,
    ms = 800,
    options?: { signal?: AbortSignal },
) => {
    let lastCallArgs: T;
    let lastCallTime = 0;
    return (...args: T) => {
        lastCallArgs = args;
        lastCallTime = Date.now();
        const g = () => {
            const elapsedTime = Date.now() - lastCallTime;
            if (elapsedTime > ms) {
                f(...lastCallArgs);
            } else {
                void timeout(ms - elapsedTime, options).then(g);
            }
        };
        void g();
    };
};
