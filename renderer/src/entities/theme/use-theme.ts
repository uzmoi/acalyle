import { darkThemeStyle, lightThemeStyle } from "./themes";
import { useColorScheme } from "./use-color-scheme";

export const useThemeStyle = (): Record<`--${string}`, string> => {
    const colorScheme = useColorScheme();
    return {
        light: lightThemeStyle,
        dark: darkThemeStyle,
    }[colorScheme];
};
