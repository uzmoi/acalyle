import { css } from "@linaria/core";
import { vars } from "~/entities/theme";
import { Link } from "~/features/location";
import { link } from "~/pages/link";
import { MemoTag } from "../lib/memo-tag";

export const Tag: React.FC<{
    tag: string;
    bookId: string;
}> = ({ tag: tagString, bookId }) => {
    const tag = MemoTag.fromString(tagString);

    if (tag === null) {
        return null;
    }

    const options = tag.getOptions();

    return (
        <span className={TagStyle} data-tag-type={tag.type}>
            <Link to={link("books/:bookId", { bookId })}>
                {tag.toBookTag()}
            </Link>
            {options && `(${options})`}
        </span>
    );
};

const TagStyle = css`
    padding: 0.2em;
    font-family: ${vars.font.mono};
`;
