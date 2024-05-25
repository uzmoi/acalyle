import type { AcalyleMemoTag } from "@acalyle/core";
import { style } from "@acalyle/css";
import { vars } from "@acalyle/ui";

export const Tag: React.FC<{
    tag: AcalyleMemoTag;
}> = ({ tag }) => {
    return (
        <span
            className={style({
                display: "inline-block",
                padding: "0.125rem 0.25rem",
                lineHeight: 1,
                fontSize: "0.75em",
                fontFamily: vars.font.mono,
                border: `1px solid ${vars.color.accent}`,
                borderRadius: vars.radius.block,
            })}
            data-tag-type={tag.type()}
        >
            <span>{tag.symbol}</span>
            {tag.prop && ":"}
            {tag.prop && <span>{tag.prop}</span>}
        </span>
    );
};
