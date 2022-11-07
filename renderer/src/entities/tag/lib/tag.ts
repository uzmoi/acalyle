import { ValueOf } from "emnorst";

export type TagType = ValueOf<typeof tagTypeTable>;
export interface Tag {
    type: TagType;
    name: string;
    args: readonly string[] | null;
}

export const tagTypeTable = {
    "@": "control",
    "#": "normal",
} as const;

export const tagHeadTable: Record<TagType, keyof typeof tagTypeTable> = {
    control: "@",
    normal: "#",
};

export const stringifyTag = (tag: Tag): string => {
    let tagString = tagHeadTable[tag.type] + tag.name;
    if (tag.args != null) {
        tagString += "(" + tag.args.join() + ")";
    }
    return tagString;
};

const tagTypes: readonly TagType[] = ["normal", "control"];
const collator = new Intl.Collator(undefined, {
    numeric: true,
    caseFirst: "upper",
});

export const compareTags = (tag1: Tag, tag2: Tag): number => {
    const diff = tagTypes.indexOf(tag1.type) - tagTypes.indexOf(tag2.type);
    if (diff !== 0) {
        return diff;
    }
    return collator.compare(tag1.name, tag2.name);
};
