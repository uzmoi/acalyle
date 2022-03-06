export const ipcChannels: Record<keyof typeof ipc, string> = {
    cwd: "cwd",
};

export const ipc = {
    cwd(): string {
        return process.cwd();
    },
};

export type IPC = {
    [P in keyof typeof ipc]: typeof ipc[P] extends (
        ...args: infer A
    ) => infer R | PromiseLike<infer R>
        ? (...args: A) => Promise<R>
        : never;
};
