import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { identify } from "emnorst";
import type { ID } from "~/__generated__/graphql";
import { link } from "~/pages/link";
import { BookThumbnail } from "~/ui/BookThumbnail";
import { Link } from "~/ui/Link";
import { useBook } from "./hook";

export const BookOverview: React.FC<{
    bookId: ID;
}> = ({ bookId }) => {
    const book = useBook(bookId);

    if (book == null) {
        return null;
    }

    const bookLink = link(":bookId", {
        bookId: book.handle ? `@${book.handle}` : book.id,
    });

    return (
        <div
            className={style({
                display: "flex",
                height: "6em",
                backgroundColor: vars.color.bg.block,
            })}
        >
            <BookThumbnail
                src={book.thumbnail}
                className={style({ flex: "0 0 auto" })}
            />
            <div
                className={style({
                    flex: "1 1 0",
                    position: "relative",
                    paddingBlock: "0.5em",
                    paddingInline: "1em",
                    overflow: "hidden",
                })}
            >
                <Link
                    to={bookLink}
                    className={style({
                        position: "absolute",
                        inset: 0,
                        zIndex: vars.zIndex.modal,
                    })}
                >
                    <span className={visuallyHidden}>Open book.</span>
                </Link>
                <p
                    className={style({
                        // (height / 2 - paddingBlock) / lineHeight
                        fontSize: `${(6 / 2 - 0.5) / 1.375}em`,
                        lineHeight: 1.375,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    })}
                >
                    {book.title}
                </p>
                <div
                    className={style({
                        borderTop: `1px solid ${vars.color.fg.mute}`,
                        paddingTop: "0.25em",
                    })}
                >
                    {book.handle && (
                        <p className={style({ fontSize: "0.75em" })}>
                            @{book.handle}
                        </p>
                    )}
                    <p
                        className={style({
                            overflow: "hidden",
                            fontSize: "0.875em",
                            // whiteSpace: "nowrap",
                            // textOverflow: "ellipsis",
                            // 複数行の三点リーダー表示
                            // stylelintが先頭の文字を小文字にしてきやがるので
                            // その対策でidentifyで囲っている。
                            display: "-webkit-box",
                            ...identify({
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }),
                            ":first-child": {
                                ...identify({
                                    WebkitLineClamp: 2,
                                }),
                            },
                        })}
                    >
                        {book.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const visuallyHidden = /* #__PURE__ */ style(
    {
        position: "fixed",
        padding: 0,
        margin: "-1px",
        width: "1px",
        height: "1px",
        opacity: "0",
        overflow: "hidden",
        border: "none",
        clip: "rect(0 0 0 0)",
    },
    "visually-hidden",
);
