import { css } from "@linaria/core";
import { Link } from "~/shared/router/react";
import { fonts } from "~/shared/ui/styles/theme";
import { parseTag } from "../lib/parse";

export const Tag: React.FC<{
    tag: string;
    bookId: string;
}> = ({ tag: tagString, bookId }) => {
    const tag = parseTag(tagString);

    if(tag === null) {
        return null;
    }

    return (
        <span className={TagStyle} data-tag-type={tag.type}>
            {tag.type === "normal" && (
                <Link pattern="books/:bookId" params={{ bookId }}>
                    {tagString}
                </Link>
            )}
            {tag.type !== "normal" && tagString}
        </span>
    );
};

const TagStyle = css`
    padding: 0.2em;
    font-family: ${fonts.mono};
`;
