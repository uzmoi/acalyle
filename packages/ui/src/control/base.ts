import { styleVariants } from "@macaron-css/core";
import { vars } from "../theme";

export type ControlPartVariant = "solid" | "outline" | "unstyled";

export const control = /* #__PURE__ */ styleVariants({
    reset: {
        padding: 0,
        font: "inherit",
        color: "inherit",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        appearance: "none",
    },
    base: {
        padding: "0.2em 0.8em",
        borderRadius: `${vars.radius.control}`,
    },
    unstyled: { padding: 0, borderRadius: 0 },
    outline: {
        border: `2px solid ${vars.color.fg.__}`,
        transition: "border-color 400ms",
        selectors: {
            "&:focus-visible": {
                borderColor: "lightgreen",
            },
            "&:focus-visible + &": {
                borderLeftColor: "lightgreen",
            },
            '&:invalid, &[aria-invalid="true"]': {
                borderColor: vars.color.denger,
            },
            '&:invalid + &, &[aria-invalid="true"] + &': {
                borderLeftColor: vars.color.denger,
            },
        },
    },
    solid: {
        backgroundColor: vars.color.bg.inline,
        borderBottom: `2px solid ${vars.color.fg.__}`,
        transition: "border-bottom-color 400ms",
        selectors: {
            "&:focus-visible": {
                borderBottomColor: "lightgreen",
            },
            '&:invalid, &[aria-invalid="true"]': {
                borderBottomColor: vars.color.denger,
            },
        },
    },
}) satisfies Record<ControlPartVariant, unknown>;
