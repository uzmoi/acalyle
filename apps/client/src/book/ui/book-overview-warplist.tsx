import { style } from "@acalyle/css";
import { List } from "@acalyle/ui";
import { useStore } from "@nanostores/react";
import { bookConnection } from "~/book/store";
import { type BookId, BookOverview } from "~/entities/book";
import type { ID } from "~/lib/graphql";

const useBookOverviewList = (query = ""): readonly ID[] => {
    const { nodeIds } = useStore(bookConnection(query));
    return nodeIds;
};

export const BookOverviewWarpList: React.FC<{
    query?: string;
}> = ({ query }) => {
    const books = useBookOverviewList(query);

    return (
        <List
            className={style({
                display: "grid",
                gap: "1em 1.25em",
                gridTemplateColumns: "repeat(auto-fit, minmax(32em, 1fr))",
            })}
        >
            {books.map(book => (
                <List.Item key={book}>
                    <BookOverview bookId={book as string as BookId} />
                </List.Item>
            ))}
        </List>
    );
};
