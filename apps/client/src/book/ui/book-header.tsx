import { style } from "@acalyle/css";
import { vars } from "@acalyle/ui";
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
            <div className=":uno: mt-2">
                {tabs.map(([link, text]) => (
                    <div key={link} className=":uno: inline-block px-2 py-1">
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
