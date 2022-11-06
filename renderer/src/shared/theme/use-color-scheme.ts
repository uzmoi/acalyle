import { useSyncExternalStore } from "react";

const darkMediaQuery = matchMedia("(prefers-color-scheme: dark)");

export const useColorScheme = () => {
    return useSyncExternalStore(
        onStoreChange => {
            darkMediaQuery.addEventListener("change", onStoreChange);
            return () => {
                darkMediaQuery.removeEventListener("change", onStoreChange);
            };
        },
        () => (darkMediaQuery.matches ? "dark" : "light"),
    );
};
