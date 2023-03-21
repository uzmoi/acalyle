import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import type { Memo } from "~/store/memo-connection";
import { TagList } from "./TagList";

export const MemoOverview: React.FC<{
    bookId: string;
    memo: Memo;
}> = ({ bookId: _, memo }) => {
    return (
        <article
            id={memo.id}
            className={style({ backgroundColor: vars.color.bg3 })}
        >
            <div>{memo.contents}</div>
            <TagList tags={memo.tags} />
        </article>
    );
};
