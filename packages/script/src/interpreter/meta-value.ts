import type { SourceLocation } from "../parser";

export abstract class MetaValue {
    declare ["__?phantom"]: "MetaValue";
}

export class RuntimeError<T extends string> extends MetaValue {
    constructor(
        readonly type: T,
        readonly loc: SourceLocation,
    ) {
        super();
    }
}
