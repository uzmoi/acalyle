import type {} from "vitest";
import linaria from "@linaria/rollup";
import react from "@vitejs/plugin-react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { visualizer } from "rollup-plugin-visualizer";
import { Plugin, defineConfig } from "vite";
import relay from "vite-plugin-relay";

const html = (define: Record<string, string> = {}): Plugin => ({
    name: "html-replace",
    transformIndexHtml: html => html
        .replace(/\$\w+/g, varName => String(define[varName.slice(1)]))
        .replace(
            /<!--\s*if(.+?)\s*-->[^]*?<!--\s*fi\s*-->/g,
            (match, test: string) => {
                const eq = /^\[(\w+)([!=^$*]=)(\w+)\]$/.exec(test.replace(/\s+/g, ""));
                if(eq) {
                    const [, lhs, op, rhs] = eq;
                    return {
                        "=": lhs === rhs,
                        "!": lhs !== rhs,
                        "^": lhs.startsWith(rhs),
                        "$": lhs.endsWith(rhs),
                        "*": lhs.includes(rhs),
                    }[op[0]] ? match : "";
                }
                return match;
            },
        ),
});

// https://vitejs.dev/config/
export default defineConfig(env => ({
    root: __dirname,
    base: "./",
    define: {
        "import.meta.vitest": false,
    },
    resolve: {
        alias: { "~/": `${__dirname}/src/` },
    },
    plugins: [
        react(),
        linaria({
            include: ["**/*.(ts|tsx)"],
            sourceMap: env.mode === "develepment",
            babelOptions: {
                presets: ["@babel/preset-typescript"],
                plugins: [["module-resolver", { alias: { "~": `${__dirname}/src` } }]],
            },
        }),
        relay,
        html({
            mode: env.mode,
        }),
    ],
    build: {
        minify: "terser",
        polyfillModulePreload: false,
        outDir: "../app",
        assetsDir: "",
        emptyOutDir: false,
        sourcemap: env.mode === "develepment",
        rollupOptions: {
            plugins: [visualizer({ emitFile: true })],
        },
    },
    test: {
        globals: true,
        environment: "happy-dom",
        includeSource: ["src/**/*.{ts,tsx}"],
        setupFiles: ["@testing-library/jest-dom"],
    },
}));
