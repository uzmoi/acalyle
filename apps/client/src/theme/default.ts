import { style } from "@acalyle/css";
import { defineTheme } from ".";

export const defaultTheme = style({
    .../* #__PURE__ */ defineTheme({
        app: {
            text: "#10141A",
            bg: "#EEEEEE",
        },
        bookOverview: {
            text: "currentColor",
            bg: "#DDDDDD",
            border: "#C0C0C0",
            round: ".75rem",
        },
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
        app: {
            text: "#DDDDDD",
            bg: "#04080A",
        },
        bookOverview: {
            text: "currentColor",
            bg: "#10141A",
            border: "#404040",
            round: ".75rem",
        },
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
