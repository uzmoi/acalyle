import * as Router from "@acalyle/router";
import { vars } from "@acalyle/ui";
import { globalStyle, style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { onMount } from "nanostores";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Location } from "./store/location";
import { BookRoute, net } from ".";

net.set({
    get: path => new URL(path, "http://localhost:4323/").href,
    async graphql(docNode, variables, options) {
        const formData = new FormData();
        const operations = JSON.stringify({
            query: docNode.loc?.source.body,
            variables,
        });
        formData.append("operations", operations);
        const res = await fetch("http://localhost:4323", {
            method: "POST",
            body: formData,
            signal: options?.signal,
        });
        if (res.ok) {
            return (await res.json()) as { data: never };
        }
        throw res.text();
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

const DevAppRoot: React.FC = () => {
    const location = useStore(Location);

    return (
        <div
            style={vars.createTheme({
                color: {
                    text: "#e0e0e0",
                    bg1: "#191c1f",
                    bg2: "#1e2125",
                    bg3: "#22262a",
                    bg4: "#101214",
                    selection: "rgba(0 128 256 / 20%)",
                },
            })}
            className={style({
                minHeight: "100%",
                fontFamily: vars.font.sans,
                color: vars.color.text,
                backgroundColor: vars.color.bg1,
            })}
        >
            <Suspense>{Router.match(BookRoute, location as never)}</Suspense>
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