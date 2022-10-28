import { themeNames } from "~/shared/theme";

export const vars = themeNames("acalyle", {
    color: ["text", "bg", "bgsub"],
    font: {
        sans: "'Noto Sans JP', sans-serif",
        mono: "'Roboto Mono', monospace",
    },
} as const);

export const lightThemeStyle = vars.createTheme({
    color: {
        "text": "#101018",
        "bg": "#d0d0d0",
        "bgsub": "#e0e0e0",
    },
});

export const darkThemeStyle = vars.createTheme({
    color: {
        "text": "#e0e0e0",
        "bg": "#101214",
        "bgsub": "#181a1c",
    },
});
