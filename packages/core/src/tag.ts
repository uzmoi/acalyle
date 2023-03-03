import { ValueOf, has } from "emnorst";

export type TagHead = keyof typeof tagTypes;
export type TagType = ValueOf<typeof tagTypes>;
export type TagSymbol = `${TagHead}${string}`;

const tagTypes = {
    "#": "normal",
    "@": "control",
} as const;

export class AcalyleMemoTag {
    static fromString(this: void, tagString: string): AcalyleMemoTag | null {
        const headChar = tagString.charAt(0);
        const hasHead = has(tagTypes, headChar);
        const head = hasHead ? (headChar as TagHead) : "#";
        const i = head === "@" ? tagString.indexOf(":") : -1;
        const name = tagString.slice(+hasHead, i === -1 ? tagString.length : i);
        if (name === "") {
            return null;
        }
        const prop = tagString.slice(i + 1 || tagString.length) || null;
        return new AcalyleMemoTag(`${head}${name}`, prop);
    }
    constructor(readonly symbol: TagSymbol, readonly prop: string | null) {}
    toString(this: this): string {
        return this.symbol + (this.prop ? ":" + this.prop : "");
    }
    type(this: this): TagType {
        return tagTypes[this.symbol[0] as TagHead];
    }
}
