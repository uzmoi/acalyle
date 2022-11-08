import { css } from "@linaria/core";
import { vars } from "~/entities/theme";
import { Link } from "~/shared/router/react";
import { MemoTag } from "../lib/memo-tag";

export const Tag: React.FC<{
    tag: string;
    bookId: string;
}> = ({ tag: tagString, bookId }) => {
    const tag = MemoTag.fromString(tagString);

    if (tag === null) {
        return null;
    }

    return (
        <span className={TagStyle} data-tag-type={tag.type}>
            {tag.type === "normal" && (
                <Link pattern="books/:bookId" params={{ bookId }}>
                    {tag.toBookTag()}
                </Link>
            )}
            {tag.type !== "normal" && tag.toString()}
        </span>
    );
};

const TagStyle = css`
    padding: 0.2em;
    font-family: ${vars.font.mono};
`;
