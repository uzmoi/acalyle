import { style } from "@macaron-css/core";

export const visuallyHidden = /* #__PURE__ */ style(
    {
        position: "fixed",
        padding: 0,
        margin: "-1px",
        width: "1px",
        height: "1px",
        opacity: 0,
        overflow: "hidden",
        border: "none",
        clip: "rect(0 0 0 0)",
    },
    "visually-hidden",
);

export const corner = (y: "upper" | "lower", x: "left" | "right") => {
    const translateX = x === "left" ? -50 : 50;
    const translateY = y === "upper" ? -50 : 50;
    return {
        position: "absolute",
        [x]: 0,
        [{ upper: "top", lower: "bottom" }[y]]: 0,
        translate: `${translateX}% ${translateY}%`,
    } satisfies React.CSSProperties;
};

export const center = () =>
    ({
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
    }) as const;
