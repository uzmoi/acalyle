import type { SourceLocation } from "../parser";

export abstract class MetaValue {
    constructor(readonly loc: SourceLocation) {}
}

export class RuntimeError extends MetaValue {
    constructor(
        readonly type: string,
        loc: SourceLocation,
    ) {
        super(loc);
    }
}
