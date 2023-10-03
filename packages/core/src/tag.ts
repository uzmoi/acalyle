import { type ValueOf, has } from "emnorst";

export type TagHead = keyof typeof tagTypes;
export type TagType = ValueOf<typeof tagTypes>;
export type TagSymbol = `${TagHead}${string}`;

const tagTypes = {
    "#": "normal",
    "@": "control",
} as const;

export type AcalyleMemoTagParseResult = {
    hasHead: boolean;
    head: TagHead;
    path: string[];
    prop: string;
    tagString: string;
};

export class AcalyleMemoTag {
    static parse(this: void, tagString: string): AcalyleMemoTagParseResult {
        const headChar = tagString.charAt(0);
        const hasHead = has(tagTypes, headChar);
        const head = hasHead ? (headChar as TagHead) : "#";

        const hasProp = head === "@";
        const propStartIndex = hasProp ? tagString.indexOf(":") : -1;

        const pathEndIndex =
            propStartIndex === -1 ? tagString.length : propStartIndex;
        const path = tagString.slice(+hasHead, pathEndIndex).split("/");
        const prop = tagString.slice(pathEndIndex + 1);

        return { hasHead, head, path, prop, tagString };
    }
    static fromString(this: void, tagString: string): AcalyleMemoTag | null {
        const { head, path, prop } = AcalyleMemoTag.parse(tagString);
        const name = path.filter(Boolean).join("/");
        if (name === "") {
            return null;
        }
        return new AcalyleMemoTag(`${head}${name}`, prop || null);
    }
    constructor(
        readonly symbol: TagSymbol,
        readonly prop: string | null,
    ) {}
    toString(this: this): string {
        return this.symbol + (this.prop ? ":" + this.prop : "");
    }
    type(this: this): TagType {
        return tagTypes[this.symbol[0] as TagHead];
    }
}
