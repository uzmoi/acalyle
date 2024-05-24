import { createRequire } from "node:module";

const require = /* #__PURE__ */ createRequire(import.meta.url);

export const tagResolver = (source: string, tag: string): string | null => {
    if (source !== "@acalyle/css") return null;

    switch (tag) {
        case "style": {
            return require.resolve("@acalyle/css/processors/style.cjs");
        }
        case "globalStyle": {
            return require.resolve("@acalyle/css/processors/global-style.cjs");
        }
        case "keyframes": {
            return require.resolve("@acalyle/css/processors/keyframes.cjs");
        }
    }

    return null;
};
