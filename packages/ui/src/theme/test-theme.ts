import { createTheme, vars } from ".";

export const devTheme = /* #__PURE__ */ createTheme<typeof vars>("acalyle", {
    color: {
        bg: {
            app: "#ddd",
            layout: "#ccc",
            block: "#bbb",
            inline: "#aaa",
        },
        fg: {
            __: "#222",
            mute: "#777",
        },
        accent: "purple",
        danger: "red",
        warning: "yellow",
        success: "green",
    },
    radius: {
        block: "0.25m",
        control: "0.5em",
        layout: "1em",
    },
    font: { mono: "monospace", sans: "sans-serif" },
    zIndex: { contextMenu: 0, max: 0, modal: 0, popover: 0, toast: 0 },
});
