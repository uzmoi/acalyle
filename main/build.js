// @ts-check

// eslint-disable-next-line import/no-extraneous-dependencies
import { build } from "esbuild";
import { mkdir, open, readdir, rm } from "fs/promises";
import * as path from "path";

const DEV = process.argv.includes("--dev");
const ENV = DEV ? "development" : "production";

/** @param {string} dirPath */
const emptyDir = async dirPath => {
    await mkdir(dirPath, { recursive: true });

    const files = await readdir(dirPath);
    await Promise.all(
        files.map(file =>
            rm(path.join(dirPath, file), {
                recursive: true,
                force: true,
            })
        )
    );
};

await emptyDir("dist");

await mkdir("../data", { recursive: true });
await (await open("../data/schema.graphql", "a")).close();

await build({
    platform: "node",
    bundle: true,
    minify: !DEV,
    sourcemap: DEV,
    watch: DEV,
    define: {
        "process.env.NODE_ENV": `"${ENV}"`,
    },
    entryPoints: ["main/src/main.ts", DEV ? "main/src/ipc.ts" : ""].filter(Boolean),
    outdir: "dist",
    external: ["electron", "sharp", DEV ? "./ipc" : ""].filter(Boolean),
});
