export type TagType = typeof tagTypeTable[keyof typeof tagTypeTable];
export interface Tag {
    type: TagType;
    name: string;
    args: string | null;
}

export const tagTypeTable = {
    "@": "control",
    "#": "normal",
} as const;

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
