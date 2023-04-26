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

export const ControlPartOutlineStyle = style({
    padding: "0.2em 0.8em",
    border: `1px solid ${vars.color.fg.__}`,
    borderRadius: `${vars.radius.control}`,
    transition: "border-color 400ms",
    selectors: {
        "&:focus": {
            borderColor: "lightgreen",
        },
        "&:focus + &": {
            borderLeftColor: "lightgreen",
        },
        '&:invalid, &[aria-invalid="true"]': {
            borderColor: "red",
        },
        '&:invalid + &, &[aria-invalid="true"] + &': {
            borderLeftColor: "red",
        },
    },
});
