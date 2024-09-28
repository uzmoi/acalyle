import { style } from "@acalyle/css";
import { defineTheme } from ".";

export const defaultTheme = style({
    .../* #__PURE__ */ defineTheme({
        note: {
            text: "#10141A",
            bg: "#DDDDDD",
        },
        tag: {
            text: "currentColor",
            bg: "transparent",
            outline: "#AA8888",
        },
    }),
    "@media (prefers-color-scheme: dark)": /* #__PURE__ */ defineTheme({
        note: {
            text: "#DDDDDD",
            bg: "#10141A",
        },
        tag: {
            text: "currentColor",
            bg: "transparent",
            outline: "#AA8888",
        },
    }),
});
