import { contextBridge, ipcRenderer } from "electron/renderer";
import * as cannels from "./cannels";

export interface Acalyle {
    cwd(): Promise<string>;
}

const acalyle: Acalyle = {
    cwd() {
        return ipcRenderer.invoke(cannels.CWD);
    },
};

contextBridge.exposeInMainWorld("acalyle", acalyle);
