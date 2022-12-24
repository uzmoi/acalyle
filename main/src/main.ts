import {
    BrowserWindow,
    LoadExtensionOptions,
    app,
    ipcMain,
    nativeTheme,
} from "electron/main";
import path = require("path");
import { ipc, ipcChannels } from "./ipc";

app.disableHardwareAcceleration();
if (process.env.NODE_ENV === "development") {
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
    if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        void win.loadURL(process.env.DEV_SERVER_URL!);
    } else {
        void win.loadFile(path.join(__dirname, "index.html"));
    }
};

const handleIpc = <T extends string>(
    // prettier-ignore
    ipc: Record<T, (this: {
        event: Electron.IpcMainInvokeEvent;
        app: Electron.App;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, ...args: any) => unknown>,
    ipcChannels: Record<T, string>,
) => {
    for (const name of Object.keys(
        ipcChannels,
    ) as (keyof typeof ipcChannels)[]) {
        ipcMain.handle(ipcChannels[name], (e, ...args) => {
            return ipc[name].apply({ event: e, app }, args);
        });
    }
};

void app.whenReady().then(async () => {
    if (process.env.NODE_ENV === "development") {
        void (async () => {
            const RELAY_DEVELOPER_TOOLS = "ncedobpgnmkhcmnnkcimnobpfepidadl";
            const {
                default: installExtension,
                REACT_DEVELOPER_TOOLS,
                // eslint-disable-next-line import/no-extraneous-dependencies
            } = await import("electron-devtools-installer");
            const loadExtensionOptions: LoadExtensionOptions = {
                allowFileAccess: true,
            };
            await installExtension(
                [REACT_DEVELOPER_TOOLS, RELAY_DEVELOPER_TOOLS],
                { loadExtensionOptions },
            );
        })().catch(console.error);
    }
    void createWindow();
    if (process.env.NODE_ENV === "development") {
        const { hmr } = await import("./hmr-node");
        // prettier-ignore
        hmr(__dirname, ["./ipc"], ({ ipc, ipcChannels }: typeof import("./ipc")) => {
            handleIpc(ipc, ipcChannels);
            return () => {
                for(const channel of Object.values(ipcChannels)) {
                    ipcMain.removeHandler(channel);
                }
            };
        });
    } else {
        handleIpc(ipc, ipcChannels);
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    void createWindow();
});
