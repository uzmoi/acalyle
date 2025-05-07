import { createTheme, theme } from "../src";

export const devTheme = createTheme({
  control: {
    text: "#10141A",
    bg: "#DDDDDD",
    outline: "#CCCCCC",
    radius: "1em",
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
  popover: {
    bg: "#EEEEEE",
    outline: "#DDDDDD",
    radius: "0.25rem",
  },
});
