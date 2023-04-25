import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { useBookId } from "~/store/hook";
import { memoConnection } from "~/store/memo-connection";
import { MemoOverview } from "./MemoOverview";

export const MemoList: React.FC<{
    bookHandle: string;
    query?: string;
}> = ({ bookHandle, query = "" }) => {
    const bookId = useBookId(bookHandle);
    const { nodeIds } = useStore(memoConnection(bookId, query));

    return (
        <List>
            {nodeIds.map(memoId => (
                <List.Item key={memoId} className={style({ marginTop: "1em" })}>
                    <MemoOverview bookId={bookHandle} memoId={memoId} />
                </List.Item>
            ))}
        </List>
    );
};
