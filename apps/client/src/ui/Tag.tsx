import type { AcalyleMemoTag } from "@acalyle/core";
import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";

export const Tag: React.FC<{
    tag: AcalyleMemoTag;
}> = ({ tag }) => {
    return (
        <span
            className={style({ fontFamily: vars.font.mono })}
            data-tag-type={tag.type()}
        >
            <span>{tag.symbol}</span>
            {tag.prop && <span>:{tag.prop}</span>}
        </span>
    );
};
