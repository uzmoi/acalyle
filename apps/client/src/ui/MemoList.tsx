import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { memoConnection } from "~/store/memo-connection";
import { MemoOverview } from "./MemoOverview";

export const MemoList: React.FC<{
    bookId: string;
}> = ({ bookId }) => {
    const { nodes } = useStore(memoConnection(bookId));

    return (
        <List>
            {nodes.map(memo => (
                <List.Item
                    key={memo.id}
                    className={style({ marginTop: "1em" })}
                >
                    <MemoOverview bookId={bookId} memo={memo} />
                </List.Item>
            ))}
        </List>
    );
};
