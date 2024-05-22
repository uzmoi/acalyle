import type { AcalyleMemoTag } from "@acalyle/core";
import { style } from "@acalyle/css";
import { vars } from "@acalyle/ui";

export const Tag: React.FC<{
    tag: AcalyleMemoTag;
}> = ({ tag }) => {
    return (
        <span
            className={style({ fontFamily: vars.font.mono })}
            data-tag-type={tag.type()}
        >
            <span>{tag.symbol}</span>
            {tag.prop && ":"}
            {tag.prop && <span>{tag.prop}</span>}
        </span>
    );
};
