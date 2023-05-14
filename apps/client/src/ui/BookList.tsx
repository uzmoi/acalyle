import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { bookConnection } from "~/store/book-connection";
import { BookOverview } from "./BookOverview";

export const BookList: React.FC = () => {
    const { nodes } = useStore(bookConnection);

    return (
        <List
            className={style({
                display: "grid",
                gap: "1em 1.25em",
                gridTemplateColumns: "repeat(auto-fit, minmax(32em, 1fr))",
            })}
        >
            {nodes.map(book => (
                <List.Item key={book.id}>
                    <BookOverview book={book} />
                </List.Item>
            ))}
        </List>
    );
};
