import type { ValueCache } from "@wyw-in-js/processor-utils";
import type { ExpressionValue } from "@wyw-in-js/shared";
import { Style } from "./types.js";

export const throwError = (message: string): never => {
    throw new Error(message);
};

export const getValue = (
    node: ExpressionValue,
    valueCache: ValueCache,
): unknown => ("value" in node ? node.value : valueCache.get(node.ex.name));

export const toCss = (style: Style | null | undefined): string => {
    if (style == null) return "";

    let css = "";

    for (const [key, value] of Object.entries(
        style as Partial<Record<keyof Style, string | number | Style>>,
    )) {
        if (value == null) continue;
        if (typeof value === "object" && !Array.isArray(value)) {
            css += `${key} {\n${toCss(value)}}\n`;
        } else {
            const cssProperty =
                key.startsWith("--") ? key : (
                    key.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)
                );
            css += [value]
                .flat()
                .map(value => `${cssProperty}: ${value};\n`)
                .join("");
        }
    }

    return css;
};
