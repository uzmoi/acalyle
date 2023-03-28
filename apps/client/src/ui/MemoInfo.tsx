import type { Memo } from "~/store/memo-connection";
import { TimeStamp } from "~/ui/TimeStamp";

export const MemoInfo: React.FC<{
    memo: Memo;
    className?: string;
}> = ({ memo, className }) => {
    return (
        <div className={className}>
            <p>
                updated <TimeStamp dt={memo.updatedAt} />
            </p>
            <p>
                created <TimeStamp dt={memo.createdAt} />
            </p>
        </div>
    );
};
