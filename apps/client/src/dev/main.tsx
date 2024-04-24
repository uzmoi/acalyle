import "@acalyle/ui/dist/style.css";
import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PageRoot } from "~/pages/Root";
import { renderModals } from "~/ui/modal/render-modals";
import { devAppTheme } from "./theme";
import "./logger";
import "./location";
import "./reset-style";

const DevAppRoot: React.FC = () => {
    return (
        <div
            style={devAppTheme}
            className={style({
                minHeight: "100%",
                fontFamily: vars.font.sans,
                color: vars.color.fg.__,
                backgroundColor: vars.color.bg.app,
            })}
        >
            <PageRoot />
            {renderModals()}
        </div>
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
