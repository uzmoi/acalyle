export interface ThemeNamesMap {
    [type: string]: readonly string[];
}

type ThemeNames<T extends ThemeNamesMap> = {
    [P in keyof T]: T[P] extends readonly (infer U extends string)[]
        ? { [_ in U]: string }
        : never;
};

export const themeNames = <T extends ThemeNamesMap>(
    prefix: string,
    themeNamesMap: T,
): ThemeNames<T> & CreateTheme => {
    const entries = Object.keys(themeNamesMap).map(type => {
        const typeValues = Object.fromEntries<string>(
            themeNamesMap[type].map(name => [name, `var(--${prefix}-${type}-${name})`]),
        );
        return [type, typeValues] as const;
    });
    return Object.fromEntries([
        ...entries,
        ["createTheme", (
            themeSource: Record<string, Record<string, string>>,
        ) => createTheme(prefix, themeSource)],
    ]) as ThemeNames<T> & CreateTheme;
};

interface CreateTheme {
    createTheme: (
        themeSource: Record<string, Record<string, string>>,
    ) => Record<`--${string}`, string>;
}

export const createTheme = <T extends Record<string, Record<string, string>>>(
    prefix: string,
    themeSource: T,
): Record<`--${string}`, string> => {
    const themeStyle: Record<`--${string}`, string> = {};
    for(const [type, value] of Object.entries(themeSource)) {
        for(const [name, v2] of Object.entries(value)) {
            const cssVarName = `--${prefix}-${type}-${name}` as const;
            themeStyle[cssVarName] = v2;
        }
    }
    return themeStyle;
};
