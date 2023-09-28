import type { ConsoleStyle } from "./style";

export const type = Symbol();

export type LogElement =
    | { [type]: "raw"; message: string }
    | { [type]: "value"; message: string; value: unknown }
    | { [type]: "style"; style: Partial<ConsoleStyle> };

export const createMessageElement = (message: string): LogElement => ({
    [type]: "raw",
    message,
});

export const createValueElement = (
    message: string,
    value: unknown,
): LogElement => ({
    [type]: "value",
    message,
    value,
});

export const createStyleElement = (
    style: Partial<ConsoleStyle>,
): LogElement => ({
    [type]: "style",
    style,
});
