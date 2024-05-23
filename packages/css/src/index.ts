import { Keyframes, Style } from "./types.js";

export const style = (style: Style): string => {
    console.error("'style' are not supported at runtime.", style);
    return "style_class_name";
};

export const globalStyle = (selector: string, style: Style): void => {
    console.error(
        "'globalStyle' are not supported at runtime.",
        selector,
        style,
    );
};

export const keyframes = (style: Keyframes): string => {
    console.error("'keyframes' are not supported at runtime.", style);
    return "keyframes_name";
};

export const cx = (...classes: (string | false | undefined | null)[]) =>
    classes.filter(Boolean).join(" ");
