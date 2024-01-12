import { createGlobalThemeContract } from "@macaron-css/core";

export const vars = /* #__PURE__ */ createGlobalThemeContract(
    {
        color: {
            fg: {
                __: null,
                mute: null,
            },
            bg: {
                app: null,
                layout: null,
                block: null,
                inline: null,
            },
            danger: null,
            warning: null,
            success: null,
            accent: null,
        },
        font: {
            sans: null,
            mono: null,
        },
        radius: {
            layout: null,
            block: null,
            control: null,
        },
        zIndex: {
            toast: null,
            modal: null,
            popover: null,
            contextMenu: null,
            max: null,
        },
    },
    (_, path) =>
        ["acalyle", ...path.filter(key => key !== "__")]
            .join("-")
            .toLowerCase(),
);
