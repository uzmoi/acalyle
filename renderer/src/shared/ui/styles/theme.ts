import { css } from "@linaria/core";
import { useSyncExternalStore } from "react";

const darkMediaQuery = matchMedia("(prefers-color-scheme: dark)");

export const useColorScheme = () => useSyncExternalStore(
    onStoreChange => {
        darkMediaQuery.addEventListener("change", onStoreChange);
        return () => {
            darkMediaQuery.removeEventListener("change", onStoreChange);
        };
    },
    () => darkMediaQuery.matches ? "dark" : "light",
);

export const colors = {
    text: "var(--color-text)",
    bg: "var(--color-bg)",
    bgSub: "var(--color-bg-sub)",
};

const light = css`
    --color-text: #101018;
    --color-bg: #d0d0d0;
    --color-bg-sub: #e0e0e0;
`;

const dark = css`
    --color-text: #e0e0e0;
    --color-bg: #101214;
    --color-bg-sub: #181a1c;
`;

export const themeClassNames = { light, dark };

export const fonts = {
    sans: "'Noto Sans JP', sans-serif",
    mono: "'Roboto Mono', monospace",
};
