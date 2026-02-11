/* eslint-disable pure-module/pure-module */
import { style } from "@acalyle/css";
import { createTheme, theme } from "@acalyle/ui";

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

  app: {
    text: "#DDDDDD",
    bg: "#0e0e12",
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  book_cover: {
    text: "currentColor",
    bg: "#14141a",
    border: "#1e1e28",
    round: "0.5rem",
  },
  note: {
    text: "currentColor",
    bg: "#14141a",
    outline: "#1e1e28",
  },
  tag: {
    text: "currentColor",
    bg: "#041e40",
    outline: "#486aa2",
  },
});

export const defaultThemeClassName = style(defaultTheme);
