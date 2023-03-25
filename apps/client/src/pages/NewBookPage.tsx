import { style } from "@macaron-css/core";
import { useCallback } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { link } from "~/pages/link";
import { createBook } from "~/store/book";
import { Location } from "~/store/location";
import { type CreateBookArgs, CreateBookForm } from "~/ui/CreateBookForm";
import { Link } from "~/ui/Link";

export const NewBookPage: React.FC = () => {
    const onCreateBook = useCallback(
        ({ title, description }: CreateBookArgs) => {
            void createBook(title, description).then(book => {
                Location.set(link(":bookId", { bookId: book.id }));
            });
        },
        [],
    );

    return (
        <main className={style({ padding: "2em" })}>
            <Link to={link("books")}>
                <BiLeftArrowAlt
                    className={style({ verticalAlign: "middle" })}
                />
                <span className={style({ verticalAlign: "middle" })}>
                    Return to books
                </span>
            </Link>
            <CreateBookForm onCreateBook={onCreateBook} />
        </main>
    );
};
