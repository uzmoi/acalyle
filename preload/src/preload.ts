import { contextBridge, ipcRenderer } from "electron/renderer";
import type { IPC } from "main/src/ipc";

const ipc: Partial<IPC> = {};
const ipcChannels: Record<keyof typeof ipc, string> = {
    cwd: "cwd",
    graphql: "graphql",
};

for (const name of Object.keys(ipcChannels) as (keyof typeof ipcChannels)[]) {
    ipc[name] = (...args: unknown[]) =>
        ipcRenderer.invoke(ipcChannels[name], ...args);
}

contextBridge.exposeInMainWorld("ipc", ipc);
