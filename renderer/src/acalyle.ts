import type { IPC } from "main/src/ipc";

declare const ipc: IPC;

export const acalyle = {
    cwd: ipc.cwd,
};
