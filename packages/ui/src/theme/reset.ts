/* eslint-disable pure-module/pure-module */
import { globalStyle } from "@acalyle/css";

globalStyle("*, ::before, ::after", {
  boxSizing: "border-box",
  margin: 0,
});

globalStyle("img, svg", {
  verticalAlign: "middle",
});
