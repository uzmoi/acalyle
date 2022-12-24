import { AtomEffect, atom } from "recoil";

export const prefersColorSchemeEffect: AtomEffect<"dark" | "light"> = ({
    setSelf,
}) => {
    const darkMediaQuery = matchMedia("(prefers-color-scheme: dark)");
    const change = () => {
        setSelf(darkMediaQuery.matches ? "dark" : "light");
    };
    change();
    darkMediaQuery.addEventListener("change", change);
    return () => {
        darkMediaQuery.removeEventListener("change", change);
    };
};

export const prefersColorScheme = atom<"dark" | "light">({
    key: "prefers-color-scheme",
    effects: [prefersColorSchemeEffect],
});
