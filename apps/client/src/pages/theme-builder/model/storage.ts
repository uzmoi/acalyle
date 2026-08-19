import * as v from "valibot";
import { declareStorage } from "#/shared/web-storage";
import { FALLBACK_THEME, Theme } from "#/entities/theme";

const themeJsonSchema = v.pipe(v.string(), v.parseJson(), Theme);

export const themeStorage = declareStorage<Theme>({
  key: "acalyle:theme-builder/theme",
  storage: localStorage,
  parse: value => {
    const { success, output } = v.safeParse(themeJsonSchema, value);
    return success ? { ...FALLBACK_THEME, ...output } : FALLBACK_THEME;
  },
  stringify: value => JSON.stringify(value),
});
