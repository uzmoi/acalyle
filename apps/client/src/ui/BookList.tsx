import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { bookConnection } from "~/store/book-connection";
import { BookOverview } from "./BookOverview";

export const BookList: React.FC = () => {
    const { nodeIds } = useStore(bookConnection);

    return (
        <List
            className={style({
                display: "grid",
                gap: "1em 1.25em",
                gridTemplateColumns: "repeat(auto-fit, minmax(32em, 1fr))",
            })}
        >
            {nodeIds.map(bookId => (
                <List.Item key={bookId}>
                    <BookOverview bookId={bookId} />
                </List.Item>
            ))}
        </List>
    );
};
