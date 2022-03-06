import path = require("path");
import { app, BrowserWindow, ipcMain } from "electron/main";
import { ipc, ipcChannels } from "./ipc";

app.disableHardwareAcceleration();

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
        height: 600,
    });
    if(process.env.NODE_ENV === "development") {
        win.loadURL(process.env.DEV_SERVER_URL!);
    } else {
        win.loadFile(path.join(__dirname, "index.html"));
    }
};

void app.whenReady().then(() => {
    if(process.env.NODE_ENV === "development") {
        void import("electron-devtools-installer")
            .then(({ default: installExtension, REACT_DEVELOPER_TOOLS }) =>
                installExtension(REACT_DEVELOPER_TOOLS, {
                    loadExtensionOptions: { allowFileAccess: true },
                })
            )
            .catch(console.error);
    }
    createWindow();
    for(const name of Object.keys(ipcChannels) as (keyof typeof ipcChannels)[]) {
        ipcMain.handle(ipcChannels[name], (_, ...args) => {
            const f: (...args: any) => unknown = ipc[name];
            return f(...args);
        });
    }
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    createWindow();
});
