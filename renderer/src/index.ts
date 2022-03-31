import { createRoot } from "react-dom/client";
import { root } from "./root";

const appEl = document.getElementById("app");
if(appEl != null) {
    createRoot(appEl).render(root);
}
