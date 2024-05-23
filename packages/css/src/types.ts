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
