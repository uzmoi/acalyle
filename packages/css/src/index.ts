import type { Properties } from "csstype";

type MultiRecord<T> = {
    [P in keyof T]: T[P] | T[P][];
};

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface PropertiesWithVars extends MultiRecord<Properties> {
    [vars: `--${string}`]: string;
}

interface NestedSelectors {
    [selector: `&${string}`]: this;
    [selector: `${string} &${string}`]: this;
}

type AtRules = "@container" | "@media" | "@supports";
type AtQueries = {
    [P in `${AtRules} ${string}`]: Style & { [_ in P]: never };
};

export interface Style extends PropertiesWithVars, NestedSelectors, AtQueries {}

type KeyframeStep = "from" | "to" | `${number}%`;
export type Keyframes = {
    [_ in KeyframeStep | `${KeyframeStep}, ${string}`]?: PropertiesWithVars;
};

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
