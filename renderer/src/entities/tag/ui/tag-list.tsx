import { AcalyleMemoTag } from "@acalyle/core";
import { css } from "@linaria/core";
import { nonNullable } from "emnorst";
import { List } from "~/shared/base";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    bookId: string;
}> = ({ tags, bookId }) => {
    return (
        <List className={TagListStyle}>
            {tags
                .map(AcalyleMemoTag.fromString)
                .filter(nonNullable)
                .map(tag => (
                    <List.Item key={tag.symbol} className={TagListItemStyle}>
                        <Tag tag={tag} bookId={bookId} />
                    </List.Item>
                ))}
        </List>
    );
};

const TagListStyle = css`
    /* - */
`;

const TagListItemStyle = css`
    display: inline;
`;
