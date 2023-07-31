export const requestToPromise = <T>(req: IDBRequest<T>): Promise<T> =>
    new Promise((resolve, reject) => {
        const onSuccess = () => {
            resolve(req.result);
            off();
        };
        const onError = () => {
            reject(req.error);
            off();
        };
        req.addEventListener("success", onSuccess);
        req.addEventListener("error", onError);
        const off = () => {
            req.removeEventListener("success", onSuccess);
            req.removeEventListener("error", onError);
        };
    });
