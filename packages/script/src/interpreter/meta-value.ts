export abstract class MetaValue {
    declare ["__?phantom"]: "MetaValue";
}

export class RuntimeError extends MetaValue {}
