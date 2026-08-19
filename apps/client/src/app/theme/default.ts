/* eslint-disable pure-module/pure-module */
import { createTheme, theme } from "@acalyle/ui";
import { style } from "asarina";

// TODO: とりあえずで設定してから開発中に弄るなどして乱雑無章なのでなんとかする。

export const defaultTheme = createTheme({
  paper: {
    bg: "#222",
    outline: "#888",
    radius: "0.25rem",
    shadow: "#11111122",
  },
  control: {
    text: "#DDDDDD",
    bg: "#181818",
    outline: "#3f3f46",
    radius: "0.25rem",
  },
  "control:focus": {
    text: theme("control-text"),
    bg: theme("control-bg"),
    outline: "#8888DD",
  },
  "control:hover": {
    text: theme("control-text"),
    bg: theme("control-bg"),
    outline: "#8888DD",
  },
  "control:active": {
    text: theme("control-text"),
    bg: theme("control-bg"),
    outline: "#7744AA",
  },
  "control:invalid": {
    text: theme("control-text"),
    bg: theme("control-bg"),
    outline: "#EE4444",
  },
  "control:disabled": {
    text: `rgb(from ${theme("control-text")} r g b / 0.5)`,
    bg: theme("control-bg"),
    outline: theme("control-outline"),
  },
  modal: {
    backdrop: "#0004",
  },
});

export const defaultThemeClassName = style(defaultTheme);
