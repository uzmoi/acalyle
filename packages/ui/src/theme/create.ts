import { type Normalize, type ValueOf, isArray } from "emnorst";

// TODO: to emnorst
type PartiallyPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ValueNames = readonly string[];
type ValueNamesOrValueDefaults = ValueNames | { [valueName: string]: string };

const valueNames = (
    valueNamesSource: ValueNamesOrValueDefaults,
): ValueNames => {
    if (isArray(valueNamesSource)) {
        return valueNamesSource;
    }
    return Object.keys(valueNamesSource);
};

interface ThemeSourceMap {
    [valueTypeName: string]: ValueNamesOrValueDefaults;
}

type ThemeVars<T extends ThemeSourceMap> = {
    [P in keyof T]: Record<
        T[P] extends readonly (infer U extends string)[] ? U : keyof T[P],
        `var(--${string})`
    >;
};

type ThemeSource<T extends ThemeSourceMap> = PartiallyPartial<
    {
        [P in keyof T]: T[P] extends readonly (infer U extends string)[]
            ? { readonly [_ in U]: string }
            : { readonly [_ in keyof T[P]]?: string };
    },
    {
        [P in keyof T]: T[P] extends readonly unknown[] ? never : P;
    }[keyof T]
>;

export const themeNames = <const T extends ThemeSourceMap>(
    prefix: string,
    themeSourceMap: T,
): Normalize<ThemeVars<T> & CreateTheme<T>> => {
    const themeSourceEntries = Object.entries(themeSourceMap).map(entry => {
        const [valueTypeName, themeSourceValues] = entry;
        // prettier-ignore
        const varMapEntries = valueNames(themeSourceValues).map(valueName => [
            valueName,
            `var(--${prefix}-${valueTypeName}-${valueName})`,
        ] as const);
        return [
            valueTypeName,
            Object.fromEntries<`var(--${string})`>(varMapEntries),
        ] as const;
    });
    return Object.fromEntries([
        ...themeSourceEntries,
        [
            "createTheme",
            (themeSource: ThemeSource<T>) =>
                createTheme(prefix, themeSource, themeSourceMap),
        ],
    ]) as Normalize<ThemeVars<T> & CreateTheme<T>>;
};

interface CreateTheme<T extends ThemeSourceMap> {
    createTheme: (
        themeSource: Normalize<ThemeSource<T>>,
    ) => Record<`--${string}`, string>;
}

const createTheme = <T extends ThemeSourceMap>(
    prefix: string,
    themeSource: ThemeSource<T>,
    themeSourceMap: T,
): Record<`--${string}`, string> => {
    const themeStyle: Record<`--${string}`, string> = {};
    for (const valueTypeName of Object.keys(themeSourceMap)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const valueName of valueNames(themeSourceMap[valueTypeName]!)) {
            const cssVarName =
                `--${prefix}-${valueTypeName}-${valueName}` as const;
            const cssVarValue = String(
                themeSource[valueTypeName as never]?.[valueName] ??
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    themeSourceMap[valueTypeName as keyof T]![
                        valueName as keyof ValueOf<T>
                    ],
            );
            themeStyle[cssVarName] = cssVarValue;
        }
    }
    return themeStyle;
};
