import { useStore } from "@nanostores/react";
import { memoStore } from "~/store/memo";
import { TagList } from "./TagList";

export const Memo: React.FC<{
    memoId: string;
}> = ({ memoId }) => {
    const memo = useStore(memoStore(memoId));

    if (memo == null) {
        return null;
    }

    return (
        <article>
            <header>
                <TagList tags={memo.tags} />
            </header>
            <div>{memo.contents}</div>
        </article>
    );
};
