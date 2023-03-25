import { style } from "@macaron-css/core";
import { vars } from "../theme";

export const ControlPartResetStyle = style({
    padding: 0,
    font: "inherit",
    color: "inherit",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    appearance: "none",
});

export const borderRadius = "4px";
export const ControlPartOutlineStyle = style({
    padding: "0.2em 0.8em",
    border: `1px solid ${vars.color.text}`,
    borderRadius: `${borderRadius}`,
    transition: "border-color 400ms",
    ":focus": {
        borderColor: "lightgreen",
    },
    selectors: {
        '&:invalid, &[aria-invalid="true"]': {
            borderColor: "red",
        },
    },
});
