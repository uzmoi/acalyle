import { style } from "@macaron-css/core";
import { useCallback } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { link } from "~/pages/link";
import type { Book } from "~/store/book-connection";
import { Location } from "~/store/location";
import { CreateBookForm } from "~/ui/CreateBookForm";
import { Link } from "~/ui/Link";

export const NewBookPage: React.FC = () => {
    const onCreatedBook = useCallback((book: Book) => {
        Location.set(
            link(":bookId", {
                bookId: book.handle ? `@${book.handle}` : book.id,
            }),
        );
    }, []);

    return (
        <main className={style({ padding: "1.25em" })}>
            <Link to={link("books")}>
                <BiLeftArrowAlt
                    className={style({ verticalAlign: "middle" })}
                />
                <span className={style({ verticalAlign: "middle" })}>
                    Return to books
                </span>
            </Link>
            <CreateBookForm onCreatedBook={onCreatedBook} />
        </main>
    );
};
