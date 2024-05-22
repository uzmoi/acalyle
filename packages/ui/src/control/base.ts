import { style } from "@acalyle/css";
import { vars } from "../theme";

export type ControlPartVariant = "solid" | "outline" | "unstyled";

export const control = {
    reset: style({
        padding: 0,
        font: "inherit",
        color: "inherit",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        appearance: "none",
    }),
    base: style({
        padding: "0.2em 0.8em",
        borderRadius: `${vars.radius.control}`,
    }),
    unstyled: style({ padding: 0, borderRadius: 0 }),
    outline: style({
        border: `2px solid ${vars.color.fg.__}`,
        transition: "border-color 400ms",
        // cspell:word lightgreen
        "&:focus-visible": {
            borderColor: "lightgreen",
        },
        "&:focus-visible + &": {
            borderLeftColor: "lightgreen",
        },
        '&:invalid, &[aria-invalid="true"]': {
            borderColor: vars.color.danger,
        },
        '&:invalid + &, &[aria-invalid="true"] + &': {
            borderLeftColor: vars.color.danger,
        },
    }),
    solid: style({
        backgroundColor: vars.color.bg.inline,
        borderBottom: `2px solid ${vars.color.fg.__}`,
        transition: "border-bottom-color 400ms",
        "&:focus-visible": {
            borderBottomColor: "lightgreen",
        },
        '&:invalid, &[aria-invalid="true"]': {
            borderBottomColor: vars.color.danger,
        },
    }),
} satisfies Record<"reset" | "base" | ControlPartVariant, unknown>;
