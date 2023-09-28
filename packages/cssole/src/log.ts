import { assert } from "emnorst";
import { type LogElement, type } from "./log-element";
import { type ConsoleStyle, printConsoleStyle } from "./style";

export const logArg = (logElements: Iterable<LogElement>) => {
    let message = "";
    const values: unknown[] = [];
    const currentStyle: Partial<ConsoleStyle> = {};
    for (const logElement of logElements) {
        switch (logElement[type]) {
            case "raw":
                message += logElement.message;
                break;
            case "value":
                message += logElement.message;
                values.push(logElement.value);
                break;
            case "style":
                Object.assign(currentStyle, logElement.style);
                message += "%c";
                values.push(printConsoleStyle(currentStyle));
                break;
            default:
                assert.unreachable<typeof logElement>();
        }
    }
    return { message, values };
};

export type ConsoleFunctionType = (
    message: string,
    ...values: unknown[]
) => void;

export const createLogFunction =
    (consoleFunction: ConsoleFunctionType) =>
    (logElements: Iterable<LogElement>) => {
        const { message, values } = logArg(logElements);
        consoleFunction(message, ...values);
    };

declare const console: { log: ConsoleFunctionType };

export const log = /* #__PURE__ */ createLogFunction(console.log);
