import { type Primitive, isObject } from "emnorst";

// @vanilla-extract/dynamic

type MapLeafNodes<Obj, LeafType> = {
    [Prop in keyof Obj]: Obj[Prop] extends Primitive
        ? LeafType
        : Obj[Prop] extends Record<string | number, unknown>
        ? MapLeafNodes<Obj[Prop], LeafType>
        : never;
};

type ThemeSource = string | { [_ in string]: ThemeSource };

export const createTheme = <T extends ThemeSource>(
    prefix: string,
    themeSource: MapLeafNodes<T, string | number>,
): Record<`--${string}`, string> => {
    const themeStyle: Record<`--${string}`, string> = {};
    for (const [key, value] of Object.entries(themeSource)) {
        const name = (key === "__" ? prefix : `${prefix}-${key}`).toLowerCase();
        if (isObject(value)) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            Object.assign(themeStyle, createTheme<{}>(name, value));
        } else {
            themeStyle[`--${name}`] = String(value);
        }
    }
    return themeStyle;
};
