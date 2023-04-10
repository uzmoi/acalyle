import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { bookHandleStore } from "~/store/book";
import { memoConnection } from "~/store/memo-connection";
import { MemoOverview } from "./MemoOverview";

export const MemoList: React.FC<{
    bookHandle: string;
}> = ({ bookHandle }) => {
    const bookId =
        usePromiseLoader(
            useStore(
                bookHandleStore(
                    bookHandle.startsWith("@") ? bookHandle.slice(1) : "",
                ),
            ),
        ) ?? bookHandle;
    const { nodes } = useStore(memoConnection(bookId));

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
