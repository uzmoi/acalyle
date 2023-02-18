import { css } from "@linaria/core";
import { List } from "~/shared/base";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    bookId: string;
}> = ({ tags, bookId }) => {
    return (
        <List className={TagListStyle}>
            {tags.map(tag => (
                <List.Item key={tag} className={TagListItemStyle}>
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
