import { css } from "@linaria/core";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    bookId: string;
}> = ({ tags, bookId }) => {
    return (
        <ul className={TagListStyle}>
            {tags.map(tag => (
                <li key={tag} className={TagListItemStyle}>
                    <Tag tag={tag} bookId={bookId} />
                </li>
            ))}
        </ul>
    );
};

const TagListStyle = css`
`;

const TagListItemStyle = css`
    display: inline;
`;
