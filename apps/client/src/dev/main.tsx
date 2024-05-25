/* eslint-disable pure-module/pure-module */

import "@acalyle/ui/dist/style.css";

import { globalStyle } from "@acalyle/css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PageRoot } from "~/pages/Root";
import { renderModals } from "~/ui/modal/render-modals";
import { Provider } from "./provider";
import "./logger";
import "./location";

globalStyle(":root, body, #app", {
    height: "100%",
});

const DevAppRoot: React.FC = () => {
    return (
        <Provider>
            <PageRoot />
            {renderModals()}
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
