import { FALLBACK_THEME } from "./theme";
import { createThemeDefinitionStyle } from "./style";

export const useThemeDefinitionStyle = (): Record<`--${string}`, string> => {
  return createThemeDefinitionStyle(FALLBACK_THEME);
};
