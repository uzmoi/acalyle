import { AcalyleMemoTag } from "@acalyle/core";
import { cx, style } from "@acalyle/css";
import { List } from "@acalyle/ui";
import { nonNullable } from "emnorst";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    className?: string;
}> = ({ tags, className }) => {
    const noteTags = tags.map(AcalyleMemoTag.fromString).filter(nonNullable);

    return (
        <List className={cx(style({ paddingInline: "0.5em" }), className)}>
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
