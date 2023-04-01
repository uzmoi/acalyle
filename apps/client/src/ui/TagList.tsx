import { AcalyleMemoTag } from "@acalyle/core";
import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { nonNullable } from "emnorst";
import { Tag } from "./Tag";

export const TagList: React.FC<{
    tags: readonly string[];
    className?: string;
}> = ({ tags: tagStrings, className }) => {
    const tags = tagStrings.map(AcalyleMemoTag.fromString).filter(nonNullable);

    return (
        <List className={className}>
            {tags.map(tag => (
                <List.Item
                    key={tag.symbol}
                    className={style({
                        display: "inline-block",
                        paddingInline: "0.25em",
                    })}
                >
                    <Tag tag={tag} />
                </List.Item>
            ))}
        </List>
    );
};
