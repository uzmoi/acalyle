import type { AcalyleMemoTag } from "@acalyle/core";
import { css } from "@linaria/core";
import { vars } from "~/entities/theme";
import { Link } from "~/features/location";
import { link } from "~/pages/link";

export const Tag: React.FC<{
    tag: AcalyleMemoTag;
    bookId: string;
}> = ({ tag, bookId }) => {
    return (
        <span className={TagStyle} data-tag-type={tag.type()}>
            <Link to={link("books/:bookId", { bookId })}>{tag.symbol}</Link>
            {tag.prop && `:${tag.prop}`}
        </span>
    );
};

const TagStyle = css`
    padding: 0.2em;
    font-family: ${vars.font.mono};
`;
