import {
    type LogElement,
    createStyleElement,
    createValueElement,
} from "./log-element";

export const cssole = {
    string: (string: string) => createValueElement("%s", string),
    float: (float: number) => createValueElement("%f", float),
    int: (int: number) => createValueElement("%i", int),
    /**
     * optimally useful formatting
     */
    useful: (value: unknown) => createValueElement("%o", value),
    /**
     * generic JavaScript object formatting
     */
    object: (value: unknown) => createValueElement("%O", value),
    style: createStyleElement,
} satisfies Record<string, (x: never) => LogElement>;
