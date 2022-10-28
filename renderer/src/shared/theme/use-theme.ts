import { darkThemeStyle, lightThemeStyle } from "~/entities/theme";
import { useColorScheme } from "./use-color-scheme";

export const useThemeStyle = (): Record<`--${string}`, string> => {
    const colorScheme = useColorScheme();
    return {
        light: lightThemeStyle,
        dark: darkThemeStyle,
    }[colorScheme];
};
