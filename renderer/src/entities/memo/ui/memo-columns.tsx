import { css } from "@linaria/core";
import { clamp } from "emnorst";
import { useMemo, useState } from "react";
import { columnSplit } from "~/shared/columns";
import { useResize } from "~/shared/ui/hooks/use-resize";
import { contentsHeight } from "../lib/contents";
import { MemoOverview } from "./overview";

const columnWidth = 256;

export const MemoColumns: React.FC<{
    bookId: string;
    memos: readonly {
        id: string;
        contents: string;
        tags: readonly string[];
    }[];
}> = ({ bookId, memos }) => {
    const [columnsCount, setColumnsCount] = useState(16);
    const columnsEl = useResize<HTMLDivElement>(entry => {
        setColumnsCount(
            clamp(Math.floor(entry.contentRect.width / columnWidth), 1, 6),
        );
    });

    const columns = useMemo(() => {
        return columnSplit(
            memos.map(memo => ({
                node: memo,
                height: contentsHeight(memo.contents),
            })),
            columnsCount,
        );
    }, [memos, columnsCount]);

    return (
        <div ref={columnsEl} className={ColumnListStyle}>
            {columns.map((column, i) => (
                <div key={i} className={ColumnStyle}>
                    {column.map(({ node, height }) => (
                        <div
                            key={node.id}
                            style={{ "--height": height }}
                            // height * (heightUnit + margin) - margin
                            className={css`
                                height: calc(var(--height) * 9em - 1em);
                                margin-block: 1em;
                                overflow: hidden;
                            `}
                        >
                            <MemoOverview bookId={bookId} memo={node} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const ColumnListStyle = css`
    display: flex;
`;

const ColumnStyle = css`
    flex: 1 0 0;
    min-width: 0;
    & + & {
        margin-left: 1em;
    }
`;
