import * as chokidar from "chokidar";
import path = require("path");

type Dispose = () => void;
type HmrAction = (...x: never[]) => Dispose | void;

export const hmr = (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __dirname: string,
    paths: string[],
    hmrAction: HmrAction,
): Dispose => {
    let dispose: Dispose | void;
    const resolvedPaths = paths.map(path => require.resolve(path));
    const watcher = chokidar.watch(resolvedPaths, {
        cwd: __dirname,
        awaitWriteFinish: true,
    });
    watcher.on("all", (_, updatedFilePath) => {
        const resolvedPath = require.resolve(
            path.join(__dirname, updatedFilePath),
        );
        console.log("hmr", path.relative(process.cwd(), resolvedPath));
        delete require.cache[resolvedPath];
        dispose?.();
        // @ts-expect-error: never
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        dispose = hmrAction(...paths.map(require));
    });
    return () => {
        watcher.unwatch(resolvedPaths);
    };
};
