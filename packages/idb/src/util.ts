export const onAll = <T extends EventTarget>(
    eventTarget: T,
    handlers: {
        [P in keyof T as P extends `on${infer K}` ? K : never]?: Extract<
            T[P],
            EventListener
        >;
    },
) => {
    const listeners = Object.entries<EventListenerOrEventListenerObject>(
        handlers as Record<string, EventListenerOrEventListenerObject>,
    );
    for (const [type, listener] of listeners) {
        eventTarget.addEventListener(type, listener);
    }
    return () => {
        for (const [type, listener] of listeners) {
            eventTarget.removeEventListener(type, listener);
        }
    };
};

export const requestToPromise = <T>(req: IDBRequest<T>): Promise<T> =>
    new Promise((resolve, reject) => {
        const offAll = onAll(req, {
            success() {
                resolve(req.result);
                offAll();
            },
            error() {
                reject(req.error);
                offAll();
            },
        });
    });
