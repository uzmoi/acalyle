import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { link } from "~/pages/link";
import { memoStore } from "~/store/memo";
import { Link } from "./Link";
import { TagList } from "./TagList";

export const MemoOverview: React.FC<{
    bookId: string;
    memoId: string;
}> = ({ bookId, memoId }) => {
    const memo = usePromiseLoader(useStore(memoStore(memoId)));

    if (memo == null) {
        return null;
    }

    return (
        <article
            id={memo.id}
            className={style({
                backgroundColor: vars.color.bg.block,
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
