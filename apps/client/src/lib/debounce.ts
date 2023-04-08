import { timeout } from "emnorst";

export const debounce = (
    f: () => void,
    ms = 800,
    options?: { signal?: AbortSignal },
) => {
    let lastCallTime = 0;
    return () => {
        lastCallTime = Date.now();
        const g = () => {
            const elapsedTime = Date.now() - lastCallTime;
            if (elapsedTime > ms) {
                f();
            } else {
                void timeout(ms - elapsedTime, options).then(g);
            }
        };
        void g();
    };
};
