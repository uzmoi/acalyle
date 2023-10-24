import { Value } from "../types";
import { UnitValue } from "./unit";

export class TupleValue extends Value {
    constructor(
        readonly elements: readonly Value[],
        readonly properties: Record<string, Value>,
    ) {
        super();
    }
    get(name: string): Value {
        return (
            (/\D/.test(name)
                ? this.properties[name]
                : this.elements[Number(name)]) ?? new UnitValue()
        );
    }
}
