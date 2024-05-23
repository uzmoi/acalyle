import {
    BaseProcessor,
    Params,
    Rules,
    TailProcessorParams,
    ValueCache,
    validateParams,
} from "@wyw-in-js/processor-utils";
import type { ExpressionValue, Replacements } from "@wyw-in-js/shared";

export abstract class CallProcessor extends BaseProcessor {
    protected readonly args: readonly ExpressionValue[];
    constructor(params: Params, ...restParams: TailProcessorParams) {
        validateParams(params, ["callee", "call"], BaseProcessor.SKIP);
        const [callee, [, ...args]] = params;
        super([callee], ...restParams);
        this.dependencies.push(...args);
        this.args = args;
    }
    abstract extractRules(values: ValueCache): Rules | null;
    build(values: ValueCache) {
        if (this.artifacts.length > 0) {
            throw new Error("Already built");
        }

        const rules = this.extractRules(values);
        const sourceMapReplacements: Replacements = [];

        if (rules) {
            const cssArtifact = [rules, sourceMapReplacements];
            this.artifacts.push(["css", cssArtifact]);
        }
    }
    doEvaltimeReplacement(): void {
        this.replacer(this.value, false);
    }
    doRuntimeReplacement(): void {
        this.replacer(this.value, false);
    }
}
