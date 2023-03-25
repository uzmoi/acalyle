import { AcalyleMemoTag } from "@acalyle/core";
import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { nonNullable } from "emnorst";
import { Tag } from "./Tag";

export const TagList: React.FC<{
    tags: readonly string[];
}> = ({ tags: tagStrings }) => {
    const tags = tagStrings.map(AcalyleMemoTag.fromString).filter(nonNullable);

    return (
        <List>
            {tags.map(tag => (
                <List.Item
                    key={tag.symbol}
                    className={style({ display: "inline-block" })}
                >
                    <Tag tag={tag} />
                </List.Item>
            ))}
        </List>
    );
};
