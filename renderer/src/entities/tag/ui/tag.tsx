import { css } from "@linaria/core";
import { fonts } from "~/shared/ui/styles/theme";
import { parseTag } from "../lib/parse";

export const Tag: React.FC<{
    tag: string;
}> = ({ tag: tagString }) => {
    const tag = parseTag(tagString);

    if(tag === null) {
        return null;
    }

    return (
        <span className={TagStyle} data-tag-type={tag.type}>
            {tag.name}
        </span>
    );
};

const TagStyle = css`
    padding: 0.2em;
    font-family: ${fonts.mono};
    &[data-tag-type="normal"]::before {
        content: "#";
    }
    &[data-tag-type="control"]::before {
        content: "@";
    }
`;
