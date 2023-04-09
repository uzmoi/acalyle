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
            className={style({
                backgroundColor: vars.color.bg3,
                padding: "0.25em 0.75em",
            })}
        >
            <div>
                <Link to={link(":bookId/:memoId", { bookId, memoId: memo.id })}>
                    <div
                        className={style({
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                        })}
                    >
                        {memo.contents}
                    </div>
                </Link>
            </div>
            <TagList tags={memo.tags} />
        </article>
    );
};
