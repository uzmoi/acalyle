import type { MapLeafNodes } from "./create";

type VarFunction = `var(--${string})`;
type Tokens = { [_ in string]: Tokens | string | null };

const createGlobalThemeContract = <T extends Tokens>(
    tokens: T,
    mapFn: (value: string | null, path: readonly string[]) => string,
    path: readonly string[] = [],
): MapLeafNodes<T, VarFunction> => {
    for (const [key, value] of Object.entries(tokens)) {
        if (value == null) continue;
        tokens[key as keyof T] = (
            typeof tokens === "object" ?
                createGlobalThemeContract(value as Tokens, mapFn, [
                    ...path,
                    key,
                ])
            :   `var(--${mapFn(tokens, path)})`) as T[keyof T];
    }
    return tokens as unknown as MapLeafNodes<T, VarFunction>;
};

export const vars = /* #__PURE__ */ createGlobalThemeContract(
    {
        color: {
            fg: {
                __: null,
                mute: null,
            },
            bg: {
                app: null,
                layout: null,
                block: null,
                inline: null,
            },
            danger: null,
            warning: null,
            success: null,
            accent: null,
        },
        font: {
            sans: null,
            mono: null,
        },
        radius: {
            layout: null,
            block: null,
            control: null,
        },
        zIndex: {
            toast: null,
            modal: null,
            popover: null,
            contextMenu: null,
            max: null,
        },
    },
    (_, path) =>
        ["acalyle", ...path.filter(key => key !== "__")]
            .join("-")
            .toLowerCase(),
);
