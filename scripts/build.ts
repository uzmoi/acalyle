import { spawn } from "child_process";
import electronPath = require("electron");
import { BuildOptions as ESBuildOptions, build as esbuild } from "esbuild";
import { mkdir, open, readdir, rm } from "fs/promises";
import * as path from "path";
// @ts-expect-error: Only used as a path.
import relayPath = require("relay-compiler");
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    InlineConfig as ViteInlineConfig,
    createLogger,
    createServer as createViteServer,
    build as viteBuild,
} from "vite";

const DEV = process.argv.includes("--dev");
const ENV = DEV ? "development" : "production";

const spawnWithLogger = (
    name: string,
    path: string,
    args: readonly string[],
    shouldExitOnExit: boolean,
) => {
    const logger = createLogger(undefined, { prefix: `[${name}]` });
    const child = spawn(path, args);
    process.once("exit", () => child.killed || child.kill());
    child.once("exit", code => {
        if(shouldExitOnExit || code !== 0) {
            process.exit(code ?? void 0);
        }
    });
    child.stdout?.on("data", chuck => {
        logger.info(String(chuck).trim(), { timestamp: true });
    });
    child.stderr?.on("data", chuck => {
        logger.error(String(chuck).trim(), { timestamp: true });
    });
};

(async () => {
    await mkdir("app", { recursive: true });
    await Promise.all((await readdir("app")).map(file =>
        rm(path.join("app", file), { recursive: true, force: true })
    ));
    await mkdir("data", { recursive: true });
    await (await open("data/schema.graphql", "a")).close();

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

    spawnWithLogger("relay-compiler", String(relayPath), DEV ? ["--watch"] : [], false);

    const rendererViteConfig: ViteInlineConfig = {
        configFile: "renderer/vite.config.ts",
    };
    if(DEV) {
        const viteDevServer = await createViteServer(rendererViteConfig);
        await viteDevServer.listen();
        const { base, server } = viteDevServer.config;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.assign(esbuildOptions.define!, {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            "process.env.DEV_SERVER_URL": `"http://localhost:${server.port + base}"`,
        });
    } else {
        await viteBuild(rendererViteConfig);
    }

    await esbuild({
        ...esbuildOptions,
        entryPoints: ["main/src/main.ts", ...DEV ? ["main/src/ipc.ts"] : []],
        ...DEV ? { outdir: "app" } : { outfile: "app/main.js" },
        external: ["electron", ...DEV ? ["./ipc"] : []],
    });
    await esbuild({
        ...esbuildOptions,
        entryPoints: ["preload/src/preload.ts"],
        outfile: "app/preload.js",
        external: ["electron/renderer"],
    });

    if(DEV) {
        spawnWithLogger("electron", String(electronPath), ["."], true);
    }
})().catch(err => {
    console.error(err);
    process.exit(1);
});
