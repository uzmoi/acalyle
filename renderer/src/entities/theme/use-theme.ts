import { useColorScheme } from "~/shared/theme";
import { darkThemeStyle, lightThemeStyle } from "./themes";

export const useThemeStyle = (): Record<`--${string}`, string> => {
    const colorScheme = useColorScheme();
    return {
        light: lightThemeStyle,
        dark: darkThemeStyle,
    }[colorScheme];
};
