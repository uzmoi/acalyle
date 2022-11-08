import { css } from "@linaria/core";
import { nonNullable } from "emnorst";
import { MemoTag } from "../lib/memo-tag";
import { Tag } from "./tag";

export const TagList: React.FC<{
    tags: readonly string[];
    bookId: string;
}> = ({ tags, bookId }) => {
    return (
        <ul className={TagListStyle}>
            {tags
                .map(MemoTag.fromString)
                .filter(nonNullable)
                .sort(MemoTag.compare)
                .map(String)
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
