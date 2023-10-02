import { createTheme, type vars } from "@acalyle/ui";

export const devAppTheme = /* #__PURE__ */ createTheme<typeof vars>("acalyle", {
    color: {
        fg: {
            __: "#e0e0e0",
            mute: "#a0a0a0",
        },
        bg: {
            app: "#191c1f",
            layout: "#1e2125",
            block: "#22262a",
            inline: "#101214",
        },
        denger: "#e44",
        warning: "#bb4",
        success: "#1a1",
        accent: "#a88",
        // selection: "rgba(0 128 256 / 20%)",
    },
    font: {
        sans: "'Noto Sans JP', sans-serif",
        mono: "'Roboto Mono', monospace",
    },
    radius: {
        layout: "0.5em",
        block: "0.25em",
        control: "4px",
    },
    zIndex: {
        toast: 100,
        modal: 101,
        popover: 102,
        contextMenu: 103,
        max: 9999,
    },
});
