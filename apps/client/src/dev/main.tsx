/* eslint-disable pure-module/pure-module */

import "@acalyle/ui/dist/style.css";
// eslint-disable-next-line import/no-unresolved
import "virtual:uno.css";

import { globalStyle } from "@acalyle/css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "~/app/app";
import { Provider } from "./provider";
import "./logger";
import "./location";

globalStyle(":root, body, #app", {
    height: "100%",
});

const DevAppRoot: React.FC = () => {
    return (
        <Provider>
            <App />
        </Provider>
    );
};

const appEl = document.getElementById("app");
if (appEl != null) {
    createRoot(appEl).render(
        <StrictMode>
            <DevAppRoot />
        </StrictMode>,
    );
}
