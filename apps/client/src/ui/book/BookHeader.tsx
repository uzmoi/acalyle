import { style } from "@macaron-css/core";
import { link } from "~/pages/link";
import { useBook } from "~/store/hook";
import { Link } from "../Link";

export const BookHeader: React.FC<{
    book: string;
}> = ({ book: bookHandle }) => {
    const book = useBook(bookHandle);

    if (book == null) return null;

    return (
        <div>
            <h2 className={style({ paddingBottom: "0.5em" })}>
                <Link to={link(":bookId", { bookId: bookHandle })}>
                    {book.title}
                </Link>
            </h2>
        </div>
    );
};
