import { vars } from "@acalyle/ui";

export const lightThemeStyle = vars.createTheme({
    color: {
        text: "#101018",
        bg1: "#e6e8eb",
        bg2: "#e0e3e6",
        bg3: "#dadee1",
        bg4: "#d5d9dd",
        selection: "rgba(0 128 256 / 20%)",
    },
});

export const darkThemeStyle = vars.createTheme({
    color: {
        text: "#e0e0e0",
        bg1: "#191c1f",
        bg2: "#1e2125",
        bg3: "#22262a",
        bg4: "#101214",
        selection: "rgba(0 128 256 / 20%)",
    },
});
