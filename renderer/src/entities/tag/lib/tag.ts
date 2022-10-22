export type TagType = typeof tagTypeTable[keyof typeof tagTypeTable];
export interface Tag {
    type: TagType;
    name: string;
    args: string | null;
}

const tagTypeTable = {
    "@": "control",
    "#": "normal",
} as const;

export const parseTag = (tagString: string): Tag | null => {
    const type = (tagTypeTable as Record<string, TagType | undefined>)[tagString[0]];
    let status: "name" | "args" | "done" = "name";
    let name = "";
    let args = "";
    for(let i = type == null ? 0 : 1; i < tagString.length; i++) {
        const char = tagString[i];
        if(status === "name") {
            if(char === "(") {
                if(type === "control") {
                    status = "args";
                } else {
                    // normalに引数は無い
                    return null;
                }
            } else {
                name += char;
            }
        } else if(status === "args") {
            if(char === ")") {
                if(i !== tagString.length - 1) {
                    // 入力を消費しきっていない
                    return null;
                }
                status = "done";
            } else {
                args += char;
            }
        }
    }
    if(name === "" || status === "args") {
        // unexpected end of input.
        return null;
    }
    return {
        type: type ?? "normal",
        name,
        args: args === "" ? null : args,
    };
};

const tagHeadTable: Record<TagType, keyof typeof tagTypeTable> = {
    control: "@",
    normal: "#",
};

export const stringifyTag = (tag: Tag): string => {
    let tagString = tagHeadTable[tag.type] + tag.name;
    if(tag.args != null) {
        tagString += "(" + tag.args + ")";
    }
    return tagString;
};

if(import.meta.vitest) {
    const { it, expect } = import.meta.vitest;
    it("normalに引数は無い", () => {
        expect(parseTag("#tag()")).toBeNull();
    });
    it("nameが空", () => {
        expect(parseTag("#")).toBeNull();
    });
    it("valid", () => {
        expect(parseTag("#tag")).toEqual({
            type: "normal",
            name: "tag",
            args: null,
        });
    });
    it("#の省略", () => {
        expect(parseTag("tag")).toEqual({
            type: "normal",
            name: "tag",
            args: null,
        });
    });
}
