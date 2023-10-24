import type { SourceLocation } from "../parser";

export abstract class MetaValue {
    declare ["__?phantom"]: "MetaValue";
}

export class RuntimeError extends MetaValue {
    constructor(readonly loc: SourceLocation) {
        super();
    }
}
