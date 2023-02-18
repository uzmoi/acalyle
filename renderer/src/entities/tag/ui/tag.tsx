import { AcalyleMemoTag } from "@acalyle/core";
import { css } from "@linaria/core";
import { vars } from "~/entities/theme";
import { Link } from "~/features/location";
import { link } from "~/pages/link";

export const Tag: React.FC<{
    tag: string;
    bookId: string;
}> = ({ tag: tagString, bookId }) => {
    const tag = AcalyleMemoTag.fromString(tagString);

    if (tag === null) {
        return null;
    }

    return (
        <span className={TagStyle}>
            <Link to={link("books/:bookId", { bookId })}>
                {tag.symbol}
            </Link>
            {tag.prop && `:${tag.prop}`}
        </span>
    );
};

const TagStyle = css`
    padding: 0.2em;
    font-family: ${vars.font.mono};
`;
