import { contextBridge, ipcRenderer } from "electron/renderer";
import { Acalyle, channels } from "../../main/src/ipc";

const acalyle: Partial<Acalyle> = {};

for(const name of Object.keys(channels) as (keyof typeof channels)[]) {
    acalyle[name] = (...args: unknown[]) =>
        ipcRenderer.invoke(channels[name], ...args);
}

contextBridge.exposeInMainWorld("acalyle", acalyle);
