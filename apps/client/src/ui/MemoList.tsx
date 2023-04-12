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
    const { nodes } = useStore(memoConnection(bookId, query));

    return (
        <List>
            {nodes.map(memo => (
                <List.Item
                    key={memo.id}
                    className={style({ marginTop: "1em" })}
                >
                    <MemoOverview bookId={bookHandle} memo={memo} />
                </List.Item>
            ))}
        </List>
    );
};
