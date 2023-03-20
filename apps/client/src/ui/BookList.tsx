import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { bookConnection } from "~/store/book-connection";
import { BookOverview } from "./BookOverview";

export const BookList: React.FC = () => {
    const { nodes } = useStore(bookConnection);

    return (
        <List>
            {nodes.map(book => (
                <List.Item
                    key={book.id}
                    className={style({ marginTop: "1em" })}
                >
                    <BookOverview book={book} />
                </List.Item>
            ))}
        </List>
    );
};
