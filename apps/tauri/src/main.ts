import { createRoot } from "react-dom/client";
import { root } from "./root";

// eslint-disable-next-line acalyle/no-module-side-effect
const appEl = document.getElementById("app");
if (appEl != null) {
    // eslint-disable-next-line acalyle/no-module-side-effect
    createRoot(appEl).render(root);
}
