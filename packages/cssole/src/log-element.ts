import { has } from "emnorst";
import type { ConsoleStyle } from "./style";

export const type = Symbol();

export const isCssoleElement = (value: unknown): value is CssoleElement =>
    has(value, type);

export type CssoleElement =
    | { [type]: "raw"; message: string }
    | { [type]: "value"; message: string; value: unknown }
    | { [type]: "style"; style: Partial<ConsoleStyle> };

export const createMessageElement = (message: string): CssoleElement => ({
    [type]: "raw",
    message,
});

export const createValueElement = (
    message: string,
    value: unknown,
): CssoleElement => ({
    [type]: "value",
    message,
    value,
});

export const createStyleElement = (
    style: Partial<ConsoleStyle>,
): CssoleElement => ({
    [type]: "style",
    style,
});
