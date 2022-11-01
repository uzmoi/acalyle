import { parseTag } from "./parse";
import { TagType, tagHeadTable } from "./tag";

export class MemoTag {
    static parse(tagString: string): MemoTag | null {
        const tag = parseTag(tagString);
        if (tag == null) {
            return null;
        }
        return new MemoTag(tag.type, tag.name.split("/"), tag.args);
    }
    private constructor(
        readonly type: TagType,
        readonly name: readonly string[],
        private readonly options: readonly string[] | null
    ) { }
    getHeadChar(): "#" | "@" {
        return tagHeadTable[this.type];
    }
    toBookTag(): string {
        return this.getHeadChar() + this.name.join("/");
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
