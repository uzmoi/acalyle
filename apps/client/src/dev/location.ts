import { onMount } from "nanostores";
import { Location } from "../store/location";

const getLocation = () =>
    location.pathname.split("/").filter(Boolean).join("/");

// eslint-disable-next-line pure-module/pure-module
onMount(Location, () => {
    const unbind = Location.listen(path => {
        if (path === getLocation()) return;
        history.pushState(null, "", path);
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
