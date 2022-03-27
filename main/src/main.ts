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

const handleIpc = <T extends string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ipc: Record<T, (...args: any) => unknown>,
    ipcChannels: Record<T, string>,
) => {
    for(const name of Object.keys(ipcChannels) as (keyof typeof ipcChannels)[]) {
        ipcMain.handle(ipcChannels[name], (_, ...args) => ipc[name].apply(null, args));
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
    if(process.env.NODE_ENV === "development") {
        type Dispose = () => void;
        type HmrAction = (...x: never[]) => Dispose | void;
        const hmr = async (paths: string[], hmrAction: HmrAction) => {
            let dispose: Dispose | void;
            const chokidar = await import("chokidar");
            const watcher = chokidar.watch(paths.map(path => require.resolve(path)), {
                cwd: __dirname,
            });
            watcher.on("all", (_, updatedFilePath) => {
                const resolvedPath = require.resolve(path.join(__dirname, updatedFilePath));
                console.log("hmr", path.relative(process.cwd(), resolvedPath));
                delete require.cache[resolvedPath];
                dispose?.();
                // @ts-expect-error: never
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                dispose = hmrAction(...paths.map(require));
            });
        };
        void hmr(["./ipc"], ({ ipc, ipcChannels }: typeof import("./ipc")) => {
            handleIpc(ipc, ipcChannels);
            return () => {
                for(const name of Object.keys(ipcChannels) as (keyof typeof ipcChannels)[]) {
                    ipcMain.removeHandler(ipcChannels[name]);
                }
            };
        });
    } else {
        handleIpc(ipc, ipcChannels);
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
