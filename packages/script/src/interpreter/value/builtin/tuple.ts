import { Value } from "../types";

export class TupleValue extends Value {
    constructor(
        readonly elements: readonly Value[],
        readonly properties: Record<string, Value>,
    ) {
        super();
    }
    get(name: string): Value | undefined {
        return /\D/.test(name)
            ? this.properties[name]
            : this.elements[Number(name)];
    }
}
