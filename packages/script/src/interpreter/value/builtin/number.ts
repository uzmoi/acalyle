import { Value } from "../types";

export class IntValue extends Value {
    constructor(readonly value: number) {
        super();
    }
}
