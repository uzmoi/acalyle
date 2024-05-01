import "@acalyle/ui/dist/style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PageRoot } from "~/pages/Root";
import { renderModals } from "~/ui/modal/render-modals";
import { Provider } from "./provider";
import "./logger";
import "./location";
import "./reset-style";

const DevAppRoot: React.FC = () => {
    return (
        <Provider>
            <PageRoot />
            {renderModals()}
        </Provider>
    );
};

// eslint-disable-next-line pure-module/pure-module
const appEl = document.getElementById("app");
if (appEl != null) {
    // eslint-disable-next-line pure-module/pure-module
    createRoot(appEl).render(
        <StrictMode>
            <DevAppRoot />
        </StrictMode>,
    );
}
