import * as Router from "@acalyle/router";
import { ModalContainer, createTheme, vars } from "@acalyle/ui";
import { globalStyle, style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { onMount } from "nanostores";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Location } from "./store/location";
import { BookRoute, net } from ".";

const baseUrl = new URL("/api/", location.origin);

net.set({
    get: path => new URL(path, baseUrl).href,
    async graphql(docNode, variables, options) {
        const operations = JSON.stringify({
            query: docNode.loc?.source.body,
            variables,
        });
        let body: BodyInit = operations;
        const shuldUseFormData = true;
        if (shuldUseFormData) {
            body = new FormData();
            body.append(
                "operations",
                new Blob([operations], { type: "application/json" }),
            );
            body.append("map", new Blob(["{}"], { type: "application/json" }));
        }
        const res = await fetch(baseUrl, {
            method: "POST",
            body,
            signal: options?.signal,
        });
        if (res.ok) {
            return (await res.json()) as { data: never };
        }
        throw await res.text();
    },
});

onMount(Location, () => {
    const getLocation = () =>
        location.pathname.split("/").filter(Boolean).join("/");
    const unbind = Location.listen(path => {
        if (path === getLocation()) return;
        history.pushState(null, "", "/" + path);
    });
    Location.set(getLocation());
    const popstate = (e: PopStateEvent) => {
        e.preventDefault();
        Location.set(getLocation());
    };
    window.addEventListener("popstate", popstate);
    return () => {
        unbind();
        window.removeEventListener("popstate", popstate);
    };
});

globalStyle("*, *::before, *::after", {
    boxSizing: "border-box",
    margin: 0,
});

globalStyle(":root, body, #app", {
    height: "100%",
});

const devAppTheme = createTheme<typeof vars>("acalyle", {
    color: {
        fg: {
            __: "#e0e0e0",
            mute: "#a0a0a0",
        },
        bg: {
            app: "#191c1f",
            layout: "#1e2125",
            block: "#22262a",
            inline: "#101214",
        },
        denger: "#e44",
        accent: "#fff",
    },
    font: {
        sans: "'Noto Sans JP', sans-serif",
        mono: "'Roboto Mono', monospace",
    },
    radius: {
        control: "4px",
        block: "0.25em",
    },
    zIndex: {
        toast: 100,
        modal: 101,
        popover: 102,
        contextMenu: 103,
        max: 9999,
    },
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
