import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import type { ID } from "~/__generated__/graphql";
import { bookConnection } from "~/store/book-connection";
import { BookOverview } from "./BookOverview";

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
                    <BookOverview bookId={book} />
                </List.Item>
            ))}
        </List>
    );
};
