import { createGlobalThemeContract } from "@macaron-css/core";

export const vars = createGlobalThemeContract(
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
            denger: null,
            accent: null,
        },
        font: {
            sans: null,
            mono: null,
        },
        radius: {
            control: null,
            block: null,
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
