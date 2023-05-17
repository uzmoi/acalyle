import { vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { identify } from "emnorst";
import type { Scalars } from "~/__generated__/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { link } from "~/pages/link";
import { bookStore } from "~/store/book";
import { BookThumbnail } from "./BookThumbnail";
import { Link } from "./Link";

export const BookOverview: React.FC<{
    bookId: Scalars["ID"];
}> = ({ bookId }) => {
    const book = usePromiseLoader(useStore(bookStore(bookId)));

    if (book == null) {
        return null;
    }

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
                    paddingBlock: "0.5em",
                    paddingInline: "1em",
                    overflow: "hidden",
                })}
            >
                <Link
                    to={link(":bookId", {
                        bookId: book.handle ? `@${book.handle}` : book.id,
                    })}
                >
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
                </Link>
            </div>
        </div>
    );
};
