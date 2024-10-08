import { NoteTag } from "@acalyle/core";
import { style } from "@acalyle/css";
import { List } from "@acalyle/ui";
import { nonNullable } from "emnorst";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    className?: string;
}> = ({ tags, className }) => {
    const noteTags = tags.map(NoteTag.fromString).filter(nonNullable);

    return (
        <List className={className}>
            {noteTags.map(tag => (
                <List.Item
                    key={tag.symbol}
                    className={style({
                        display: "inline-block",
                        paddingInline: "0.125em",
                    })}
                >
                    <Tag tag={tag} />
                </List.Item>
            ))}
        </List>
    );
};
