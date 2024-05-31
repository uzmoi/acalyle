import { type ValueOf, has } from "emnorst";

export type TagHead = keyof typeof tagTypes;
export type TagType = ValueOf<typeof tagTypes>;
export type TagSymbol = `${TagHead}${string}`;

const tagTypes = {
    "#": "normal",
    "@": "control",
} as const;

export type NoteTagParseResult = {
    hasHead: boolean;
    head: TagHead;
    path: string[];
    prop: string;
    tagString: string;
};

export class NoteTag {
    static parse(this: void, tagString: string): NoteTagParseResult {
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
    static fromString(this: void, tagString: string): NoteTag | null {
        const { head, path, prop } = NoteTag.parse(tagString);
        const name = path.filter(Boolean).join("/");
        if (name === "") {
            return null;
        }
        return new NoteTag(`${head}${name}`, prop || null);
    }
    constructor(
        readonly symbol: TagSymbol,
        readonly prop: string | null,
    ) {}
    toString(this: this): string {
        return this.symbol + (this.prop ? ":" + this.prop : "");
    }
    get type(): TagType {
        return tagTypes[this.symbol[0] as TagHead];
    }
}
