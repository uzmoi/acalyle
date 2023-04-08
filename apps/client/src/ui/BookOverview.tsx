import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { link } from "~/pages/link";
import type { Book } from "~/store/book-connection";
import { BookThumbnail } from "./BookThumbnail";
import { Link } from "./Link";

export const BookOverview: React.FC<{
    book: Book;
}> = ({ book }) => {
    return (
        <div
            className={style({
                display: "flex",
                height: "6em",
                backgroundColor: vars.color.bg3,
            })}
        >
            <BookThumbnail
                src={book.thumbnail}
                className={style({ flex: "0 0 auto" })}
            />
            <div
                className={style({
                    flex: "1 1 0",
                    paddingBlock: "0.5em",
                    paddingInline: "1em",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                })}
            >
                <p
                    className={style({
                        marginBottom: "0.25em",
                        overflow: "hidden",
                        fontSize: "2em",
                        textOverflow: "ellipsis",
                    })}
                >
                    <Link
                        to={link(":bookId", {
                            bookId: book.handle ? `@${book.handle}` : book.id,
                        })}
                    >
                        {book.title}
                    </Link>
                </p>
                <p
                    className={style({
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    })}
                >
                    {book.description}
                </p>
            </div>
        </div>
    );
};
