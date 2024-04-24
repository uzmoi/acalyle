import { createRoot } from "react-dom/client";
import { root } from "./root";

// eslint-disable-next-line pure-module/pure-module
const appEl = document.getElementById("app");
if (appEl != null) {
    // eslint-disable-next-line pure-module/pure-module
    createRoot(appEl).render(root);
}
