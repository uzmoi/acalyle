import { AcalyleMemoTag } from "@acalyle/core";
import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { nonNullable } from "emnorst";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    bookId: string;
    className?: string;
}> = ({ tags: tagStrings, bookId, className }) => {
    const tags = tagStrings.map(AcalyleMemoTag.fromString).filter(nonNullable);

    return (
        <List className={className}>
            {tags.map(tag => (
                <List.Item
                    key={tag.symbol}
                    className={style({ display: "inline-block" })}
                >
                    <Tag tag={tag} bookId={bookId} />
                </List.Item>
            ))}
        </List>
    );
};
