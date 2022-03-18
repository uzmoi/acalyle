import { spawn } from "child_process";
import electronPath = require("electron");
import { BuildOptions as ESBuildOptions, build as esbuild } from "esbuild";
import { EventEmitter } from "events";
import { rm } from "fs/promises";
import * as path from "path";
import { createServer as createViteServer, build as viteBuild } from "vite";

const DEV = process.argv.includes("--dev");
const ENV = DEV ? "development" : "production";

(async () => {
    const appPath = path.join(__dirname, "app");
    await rm(appPath, { recursive: true, force: true });

    const emitter = new EventEmitter();
    const esbuildOptions: ESBuildOptions = {
        platform: "node",
        bundle: true,
        minify: !DEV,
        sourcemap: DEV,
        watch: DEV,
        define: {
            "process.env.NODE_ENV": `"${ENV}"`,
        },
    };

    const rendererConfigFile = "renderer/vite.config.ts";
    if(DEV) {
        const viteDevServer = await createViteServer({ configFile: rendererConfigFile });
        await viteDevServer.listen();
        emitter.once("close", () => void viteDevServer.close());
        const { base, server } = viteDevServer.config;
        Object.assign(esbuildOptions.define, {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            "process.env.DEV_SERVER_URL": `"http://localhost:${server.port + base}"`,
        });
    } else {
        await viteBuild({ configFile: rendererConfigFile });
    }

    const main = await esbuild({
        ...esbuildOptions,
        entryPoints: ["main/src/main.ts"],
        outfile: "app/main.js",
        external: ["electron"],
        ...esbuildOptions,
    });
    const preload = await esbuild({
        ...esbuildOptions,
        entryPoints: ["preload/src/preload.ts"],
        outfile: "app/preload.js",
        external: ["electron/renderer"],
    });
    if(DEV) {
        emitter.once("close", () => main.stop?.());
        emitter.once("close", () => preload.stop?.());
    }

    // spawn electron
    if(DEV) {
        const child = spawn(String(electronPath), ["."], { stdio: "inherit" });
        child.on("close", () => emitter.emit("close"));
    }
})().catch(err => {
    console.error(err);
    process.exit(1);
});
