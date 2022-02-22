export const channels: Record<keyof typeof acalyle, string> = {
    cwd: "cwd",
};

export const acalyle = {
    cwd(): string {
        return process.cwd();
    },
};

export type Acalyle = {
    [P in keyof typeof acalyle]: typeof acalyle[P] extends (
        ...args: infer A
    ) => infer R | PromiseLike<infer R>
        ? (...args: A) => Promise<R>
        : never;
};
