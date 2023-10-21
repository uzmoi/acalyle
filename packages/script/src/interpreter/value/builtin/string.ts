import { Value } from "../types";

export class StringValue extends Value {
    constructor(readonly value: string) {
        super();
    }
}
