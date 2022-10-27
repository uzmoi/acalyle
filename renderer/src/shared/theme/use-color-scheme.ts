import { useSyncExternalStore } from "react";

const darkMediaQuery = matchMedia("(prefers-color-scheme: dark)");

export const useColorScheme = () => useSyncExternalStore(
    onStoreChange => {
        darkMediaQuery.addEventListener("change", onStoreChange);
        return () => {
            darkMediaQuery.removeEventListener("change", onStoreChange);
        };
    },
    () => darkMediaQuery.matches ? "dark" : "light",
);
