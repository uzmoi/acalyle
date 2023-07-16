import * as Router from "@acalyle/router";
import { ModalContainer, vars } from "@acalyle/ui";
import { globalStyle, style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { devAppTheme } from "./dev/theme";
import { Location } from "./store/location";
import { BookRoute } from ".";
import "./dev/location";

globalStyle("*, *::before, *::after", {
    boxSizing: "border-box",
    margin: 0,
});

globalStyle(":root, body, #app", {
    height: "100%",
});

const DevAppRoot: React.FC = () => {
    const location = useStore(Location);

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
            <Suspense>{Router.match(BookRoute, location as never)}</Suspense>
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
