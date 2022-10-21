import { assert } from "emnorst";

export interface Tag {
    type: "normal" | "control";
    name: string;
    args: string | null;
}

export const parseTag = (tag: string): Tag => {
    const match = /.(\w+)(?:\((.*)\))?/.exec(tag);
    const type = ({
        "@": "control",
        "#": "normal",
    } as const)[tag[0]];
    assert.nonNullable(match);
    assert.nonNullable(type);
    return {
        type,
        name: match[1],
        args: match[2] ?? null,
    };
};

export const stringifyTag = (tag: Tag): string => {
    const tagPrefix = ({
        control: "@",
        normal: "#",
    } as const)[tag.type];
    if(tag.args == null) {
        return `${tagPrefix}${tag.name}`;
    } else {
        return `${tagPrefix}${tag.name}(${tag.args})`;
    }
};
