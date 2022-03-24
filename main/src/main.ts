import { BrowserWindow, app, ipcMain, nativeTheme } from "electron/main";
import path = require("path");
import { ipc, ipcChannels } from "./ipc";

app.disableHardwareAcceleration();
if(process.env.NODE_ENV === "development") {
    nativeTheme.themeSource = "dark";
}

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 800,
        height: 600,
    });
    if(process.env.NODE_ENV === "development") {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        void win.loadURL(process.env.DEV_SERVER_URL!);
    } else {
        void win.loadFile(path.join(__dirname, "index.html"));
    }
};

void app.whenReady().then(() => {
    if(process.env.NODE_ENV === "development") {
        const RELAY_DEVELOPER_TOOLS = "ncedobpgnmkhcmnnkcimnobpfepidadl";
        // eslint-disable-next-line import/no-extraneous-dependencies
        void import("electron-devtools-installer")
            .then(({ default: installExtension, REACT_DEVELOPER_TOOLS }) => installExtension(
                [
                    REACT_DEVELOPER_TOOLS,
                    RELAY_DEVELOPER_TOOLS,
                ],
                { loadExtensionOptions: { allowFileAccess: true } },
            ))
            .catch(console.error);
    }
    createWindow();
    for(const name of Object.keys(ipcChannels) as (keyof typeof ipcChannels)[]) {
        ipcMain.handle(ipcChannels[name], (_, ...args) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const f: (...args: any) => unknown = ipc[name];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
