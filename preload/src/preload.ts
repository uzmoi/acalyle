import { contextBridge, ipcRenderer } from "electron/renderer";
// eslint-disable-next-line import/no-extraneous-dependencies
import { IPC, ipcChannels } from "main/src/ipc";

const ipc: Partial<IPC> = {};

for (const name of Object.keys(ipcChannels) as (keyof typeof ipcChannels)[]) {
    ipc[name] = (...args: unknown[]) =>
        ipcRenderer.invoke(ipcChannels[name], ...args);
}

contextBridge.exposeInMainWorld("ipc", ipc);
