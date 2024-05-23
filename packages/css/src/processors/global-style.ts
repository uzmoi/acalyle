import type {
    ProcessorParams,
    Rules,
    ValueCache,
} from "@wyw-in-js/processor-utils";
import type { ExpressionValue } from "@wyw-in-js/shared";
import { CallProcessor } from "../call-processor.js";
import { Style } from "../types.js";
import { getValue, throwError, toCss } from "../util.js";

// eslint-disable-next-line import/no-default-export
export default class GlobalStyleProcessor extends CallProcessor {
    readonly #selector: ExpressionValue;
    readonly #style: ExpressionValue;
    constructor(...params: ProcessorParams) {
        super(...params);
        [
            this.#selector = throwError("Missing arguments."),
            this.#style = throwError("Missing arguments."),
        ] = this.args;
    }
    get asSelector(): string {
        throw new Error("Not implemented.");
    }
    get value() {
        return this.astService.buildUndefinedNode();
    }
    extractRules(values: ValueCache): Rules | null {
        return {
            [String(getValue(this.#selector, values))]: {
                cssText: toCss(getValue(this.#style, values) as Style),
                className: "",
                displayName: this.displayName,
                start: this.location?.start ?? null,
            },
        };
    }
}
