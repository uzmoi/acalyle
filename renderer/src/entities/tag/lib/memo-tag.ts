import { TagType, tagHeadTable, tagTypeTable } from "./tag";

export interface MemoTagParseResult {
    head: keyof typeof tagTypeTable | null;
    name: string;
    options: readonly string[] | null;
}

const parseOptions = (options: string) => {
    return options === "" ? [] : options.split(",");
};

// eslint-disable-next-line no-control-regex
const ASCII_CONTROL_CHAR_REGEX = /[\0-\x1f\x7f]+/g;

export class MemoTag {
    static parse(this: void, tagString: string): MemoTagParseResult {
        const head = tagString[0];
        const hasHead = head in tagTypeTable;
        const i = tagString.indexOf("(");
        return {
            head: hasHead ? (head as keyof typeof tagTypeTable) : null,
            name: tagString.slice(+hasHead, i === -1 ? tagString.length : i),
            options:
                i === -1
                    ? null
                    : parseOptions(tagString.slice(i).replace(/^\(|\)$/g, "")),
        };
    }
    static from(
        type: TagType,
        tagName: readonly string[],
        options: readonly (readonly [string, string])[],
    ) {
        return new MemoTag(type, tagName, new Map(options));
    }
    static fromString(this: void, tagString: string): MemoTag | null {
        const { head, name, options } = MemoTag.parse(tagString);
        const tagName = name
            .replace(ASCII_CONTROL_CHAR_REGEX, "")
            .split("/")
            .filter(Boolean);
        if (name.length === 0) {
            // name empty
            return null;
        }
        const type = head != null ? tagTypeTable[head] : "normal";
        const optionsMap =
            options &&
            new Map(
                options.map(option => option.split("=") as [string, string]),
            );
        return new MemoTag(type, tagName, optionsMap);
    }
    private constructor(
        readonly type: TagType,
        readonly name: readonly string[],
        readonly options: ReadonlyMap<string, string> | null,
    ) {}
    getHeadChar(): "#" | "@" {
        return tagHeadTable[this.type];
    }
    getName(): string {
        return this.name.join("/");
    }
    getOption(name: string): string | undefined {
        return this.options?.get(name);
    }
    getOptions(): string {
        return Array.from(this.options ?? [])
            .map(([key, value]) => key + "=" + value)
            .join(",");
    }
    toBookTag(): string {
        return this.getHeadChar() + this.getName();
    }
    toString(): string {
        let tagString = this.toBookTag();
        const options = this.getOptions();
        if (options !== "") {
            tagString += "(" + options + ")";
        }
        return tagString;
    }
    static readonly tagTypeOrder: readonly TagType[] = ["normal", "control"];
    private static readonly collator = new Intl.Collator(undefined, {
        numeric: true,
        caseFirst: "upper",
    });
    static compare(this: void, tag1: MemoTag, tag2: MemoTag): number {
        const diff =
            MemoTag.tagTypeOrder.indexOf(tag1.type) -
            MemoTag.tagTypeOrder.indexOf(tag2.type);
        if (diff !== 0) {
            return diff;
        }
        const minLength = Math.min(tag1.name.length, tag2.name.length);
        for (let i = 0; i < minLength; i++) {
            const direction = MemoTag.collator.compare(
                tag1.name[i],
                tag2.name[i],
            );
            if (direction !== 0) {
                return direction;
            }
        }
        return tag1.name.length - tag2.name.length;
    }
}
