/* eslint-disable pure-module/pure-module */
import { style } from "@acalyle/css";
import { createTheme, theme } from "@acalyle/ui";

// TODO: とりあえずで設定してから開発中に弄るなどして乱雑無章なのでなんとかする。

export const defaultTheme = createTheme({
  paper: {
    bg: "#EEEEEE",
    outline: "#DDDDDD",
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
    outline: "#AA66EE",
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
    // bg: "#0A0C0E",
    bg: "#0A0E12",
  },
  tag: {
    text: "currentColor",
    bg: "transparent",
    outline: "#AA8888",
  },
});

export const defaultThemeClassName = style(defaultTheme);
