import { rm } from "fs/promises";
import { spawn } from "child_process";
import * as path from "path";
import { build as esbuild, BuildOptions as ESBuildOptions } from "esbuild";
import { build as viteBuild } from "vite";
import { RollupWatcher } from "rollup";
import electronPath = require("electron");

const DEV = process.argv.includes("--dev");
const ENV = DEV ? "development" : "production";

(async () => {
    const assetsPath = path.join(__dirname, "app/assets");
    await rm(assetsPath, { recursive: true, force: true });
    const esbuildOptions: ESBuildOptions = {
        platform: "node",
        bundle: true,
        minify: !DEV,
        sourcemap: DEV,
        watch: DEV,
        define: {
            "process.env.NODE_ENV": JSON.stringify(ENV),
        },
    };
    const mainPromise = esbuild({
        entryPoints: ["main/src/main.ts"],
        outfile: "app/main.js",
        external: ["electron"],
        ...esbuildOptions,
    });
    const preloadPromise = esbuild({
        entryPoints: ["preload/src/preload.ts"],
        outfile: "app/preload.js",
        external: ["electron/renderer"],
        ...esbuildOptions,
    });
    const rendererPromise = viteBuild({
        mode: ENV,
        build: {
            minify: !DEV,
            sourcemap: DEV,
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
})().catch(err => {
    console.error(err);
    process.exit(1);
});
