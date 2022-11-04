import { TagType, tagHeadTable, tagTypeTable } from "./tag";

export interface MemoTagParseResult {
    head: keyof typeof tagTypeTable | null;
    name: string;
    options: readonly string[] | null;
}

const parseOptions = (options: string) => {
    return options === "" ? [] : options.split(",");
};

export class MemoTag {
    static parse(tagString: string): MemoTagParseResult {
        const head = tagString[0];
        const hasHead = head in tagTypeTable;
        const i = tagString.indexOf("(");
        return {
            head: hasHead ? head as keyof typeof tagTypeTable : null,
            name: tagString.slice(+hasHead, i === -1 ? tagString.length : i),
            options: i === -1
                ? null
                : parseOptions(tagString.slice(i).replace(/^\(|\)$/g, "")),
        };
    }
    static fromString(tagString: string): MemoTag | null {
        const { head, name, options } = this.parse(tagString);
        const tagName = name.split("/").filter(Boolean);
        if(name.length === 0) {
            // name empty
            return null;
        }
        const type = head != null ? tagTypeTable[head] : "normal";
        return new MemoTag(type, tagName, options);
    }
    private constructor(
        readonly type: TagType,
        readonly name: readonly string[],
        private readonly options: readonly string[] | null
    ) { }
    getHeadChar(): "#" | "@" {
        return tagHeadTable[this.type];
    }
    getName(): string {
        return this.name.join("/");
    }
    toBookTag(): string {
        return this.getHeadChar() + this.getName();
    }
    toString(): string {
        let tagString = this.toBookTag();
        if(this.options != null) {
            tagString += "(" + this.options.join() + ")";
        }
        return tagString;
    }
    getOption(name: string): string | undefined {
        return this.options
            ?.find(option => option.trim().startsWith(`${name}=`))
            ?.slice(name.length);
    }
}
