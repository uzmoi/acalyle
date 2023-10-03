import { globalStyle } from "@macaron-css/core";

globalStyle("*, ::before, ::after", {
    boxSizing: "border-box",
    margin: 0,
});

globalStyle(":root, body, #app", {
    height: "100%",
});

globalStyle("img, svg", {
    verticalAlign: "middle",
});
