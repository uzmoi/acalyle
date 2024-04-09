import { Value } from "../types";

export class BoolValue extends Value {
    constructor(readonly value: boolean) {
        super();
    }
}
