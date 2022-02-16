import { spawn } from "child_process";
import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { RollupWatcher } from "rollup";
import electronPath = require("electron");

const DEV = process.argv.includes("--dev");

(async () => {
    const esbuildOptions = {
        bundle: true,
        minify: !DEV,
        watch: DEV,
    } as const;
    const mainPromise = esbuild({
        entryPoints: ["main/src/main.ts"],
        outfile: "app/main.js",
        external: ["electron/main"],
        platform: "node",
        ...esbuildOptions,
    });
    const preloadPromise = esbuild({
        entryPoints: ["preload/src/preload.ts"],
        outfile: "app/preload.js",
        external: ["electron/renderer"],
        ...esbuildOptions,
    });
    const rendererPromise = viteBuild({
        build: {
            watch: DEV ? {} : void 0,
            emptyOutDir: false,
        },
        configFile: "renderer/vite.config.ts",
    });
    if(DEV) {
        const main = await mainPromise;
        const preload = await preloadPromise;
        const renderer = await rendererPromise as RollupWatcher;
        const child = spawn(String(electronPath), ["."], { stdio: "inherit", windowsHide: false });
        child.on("close", () => {
            main.stop?.();
            preload.stop?.();
            renderer.close();
        });
    }
})().catch(() => process.exit(1));
