import { ModalContainer, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { devAppTheme } from "./dev/theme";
import { PageRoot } from "./pages/Root";
import "./dev/location";
import "./dev/reset-style";

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
            <ModalContainer />
        </div>
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
