import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { link } from "~/pages/link";
import { Link } from "~/ui/Link";
import type { BookRef } from "../store";
import { useBook } from "./hook";

export const BookHeader: React.FC<{
    bookRef: BookRef;
}> = ({ bookRef }) => {
    const book = useBook(bookRef);

    if (book == null) return null;

    const tabs = [
        [link(":bookId", { bookId: bookRef }), "Notes"],
        [link(":bookId/settings", { bookId: bookRef }), "Settings"],
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
