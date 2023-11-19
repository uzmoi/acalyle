import { style } from "@macaron-css/core";
import { link } from "~/pages/link";
import { useBook } from "~/store/hook";
import { Link } from "../Link";
import { vars } from "@acalyle/ui";

export const BookHeader: React.FC<{
    book: string;
}> = ({ book: bookHandle }) => {
    const book = useBook(bookHandle);

    if (book == null) return null;

    const tabs = [
        [link(":bookId", { bookId: bookHandle }), "Notes"],
        [link(":bookId/settings", { bookId: bookHandle }), "Settings"],
    ] as const;

    return (
        <div>
            <h2>{book.title}</h2>
            <div className={style({ marginTop: "0.5em" })}>
                {tabs.map(([link, text]) => (
                    <div
                        key={link}
                        className={style({
                            display: "inline-block",
                            padding: "0.25em 0.5em",
                        })}
                    >
                        <Link
                            to={link}
                            className={style({
                                borderBottom: `1px solid ${vars.color.fg.mute}`,
                            })}
                        >
                            {text}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
