export const requestToPromise = <T>(req: IDBRequest<T>): Promise<T> =>
    new Promise((resolve, reject) => {
        req.onsuccess = () => {
            resolve(req.result);
            off();
        };
        req.onerror = () => {
            reject(req.error);
            off();
        };
        const off = () => {
            req.onsuccess = req.onerror = null;
        };
    });
