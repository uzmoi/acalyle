import path = require("path");
import { app, BrowserWindow, ipcMain } from "electron/main";
import * as cannels from "../../preload/src/cannels";

app.disableHardwareAcceleration();

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
        height: 600,
    });
    win.loadFile(path.join(__dirname, "index.html"));
};

void app.whenReady().then(() => {
    createWindow();
    ipcMain.handle(cannels.CWD, () => process.cwd());
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    createWindow();
});
