import "@acalyle/client/dist/style.css";

import { BookRoute, Location, net } from "@acalyle/client";
import * as Router from "@acalyle/router";
import { vars } from "@acalyle/ui";
import { globalStyle, style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { onMount } from "nanostores";

net.set({
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

const themeStyle = vars.createTheme({
    color: {
        text: "#e0e0e0",
        subtext: "#a0a0a0",
        caret: vars.color.text,
        bg1: "#191c1f",
        bg2: "#1e2125",
        bg3: "#22262a",
        bg4: "#101214",
        selection: "rgba(0 128 256 / 20%)",
    },
});

export const App: React.FC = () => {
    const location = useStore(Location);

    return (
        <div
            className={style({
                minHeight: "100%",
                fontFamily: vars.font.sans,
                color: vars.color.text,
                backgroundColor: vars.color.bg1,
            })}
            style={themeStyle}
        >
            {Router.match(BookRoute, location as never)}
        </div>
    );
};
