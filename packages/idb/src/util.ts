import type { Callable } from "emnorst";

export const onceAll = <T extends EventTarget>(
    eventTarget: T,
    handlers: {
        [P in keyof T as P extends `on${infer K}` ? K : never]?: Extract<
            T[P],
            Callable
        >;
    },
) => {
    const listeners = Object.entries<EventListenerOrEventListenerObject>(
        handlers as Record<string, EventListenerOrEventListenerObject>,
    );
    const offAll = () => {
        for (const [type, listener] of listeners) {
            eventTarget.removeEventListener(type, listener);
            eventTarget.removeEventListener(type, offAll);
        }
    };
    for (const [type, listener] of listeners) {
        eventTarget.addEventListener(type, listener);
        eventTarget.addEventListener(type, offAll);
    }
    return offAll;
};

export const requestToPromise = <T>(req: IDBRequest<T>): Promise<T> =>
    new Promise((resolve, reject) => {
        onceAll(req, {
            success() {
                resolve(req.result);
            },
            error() {
                reject(req.error);
            },
        });
    });
