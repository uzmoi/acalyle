import { themeNames } from "@acalyle/ui";

export const vars = themeNames("acalyle", {
    color: [
        "text",
        "bg1", // app
        "bg2", // layout
        "bg3", // card
        "bg4", // inline
        "selection",
    ],
    font: {
        sans: "'Noto Sans JP', sans-serif",
        mono: "'Roboto Mono', monospace",
    },
} as const);

export const lightThemeStyle = vars.createTheme({
    color: {
        text: "#101018",
        bg1: "#e6e8eb",
        bg2: "#e0e3e6",
        bg3: "#dadee1",
        bg4: "#d5d9dd",
        selection: "rgba(0 128 256 / 20%)",
    },
});

export const darkThemeStyle = vars.createTheme({
    color: {
        text: "#e0e0e0",
        bg1: "#191c1f",
        bg2: "#1e2125",
        bg3: "#22262a",
        bg4: "#101214",
        selection: "rgba(0 128 256 / 20%)",
    },
});
