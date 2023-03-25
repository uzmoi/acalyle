import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { link } from "~/pages/link";
import type { Memo } from "~/store/memo-connection";
import { Link } from "./Link";
import { TagList } from "./TagList";

export const MemoOverview: React.FC<{
    bookId: string;
    memo: Memo;
}> = ({ bookId, memo }) => {
    return (
        <article
            id={memo.id}
            className={style({ backgroundColor: vars.color.bg3 })}
        >
            <div>
                <Link to={link(":bookId/:memoId", { bookId, memoId: memo.id })}>
                    {memo.contents}
                </Link>
            </div>
            <TagList tags={memo.tags} />
        </article>
    );
};
