import { FALLBACK_THEME } from "./theme";
import { createThemeDefineStyle } from "./style";

export const useThemeDefinitionStyle = (): Record<`--${string}`, string> => {
  return createThemeDefineStyle(FALLBACK_THEME);
};
