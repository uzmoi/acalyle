import { css } from "@linaria/core";
import { parseTag } from "../lib/parse";
import { compareTags, stringifyTag } from "../lib/tag";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    bookId: string;
}> = ({ tags, bookId }) => {
    return (
        <ul className={TagListStyle}>
            {tags
                .map(parseTag)
                .filter(<T,>(v: T): v is NonNullable<T> => v != null)
                .sort(compareTags)
                .map(stringifyTag)
                .map(tag => (
                    <li key={tag} className={TagListItemStyle}>
                        <Tag tag={tag} bookId={bookId} />
                    </li>
                ))}
        </ul>
    );
};

const TagListStyle = css`
    /* - */
`;

const TagListItemStyle = css`
    display: inline;
`;
