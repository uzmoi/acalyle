import * as Router from "@acalyle/router";
import { style } from "@macaron-css/core";
import { Suspense } from "react";
import { MemoListPage } from "~/pages/book/MemoListPage";
import { useBook } from "~/store/hook";
import { Link } from "~/ui/Link";
import { Memo } from "~/ui/Memo";
import { link } from "./link";

export type BookPageRoute = Router.Routes<{
    "": Router.Page<"bookId">;
    ":memoId": Router.Page;
    resources: Router.Page;
    settings: Router.Page;
}>;

const BookPageRoute = Router.routes<BookPageRoute, JSX.Element | null>({
    "": Router.page(({ bookId: bookHandle }) => (
        <MemoListPage bookHandle={bookHandle} />
    )),
    resources: Router.page(() => null),
    settings: Router.page(() => null),
    ":memoId": Router.page(({ bookId: bookHandle, memoId }) => (
        <Memo bookHandle={bookHandle} memoId={memoId} />
    )),
});

export const BookPage: React.FC<{
    bookHandle: string;
    path: readonly string[];
}> = ({ bookHandle, path }) => {
    const book = useBook(bookHandle);

    if (book == null) {
        return null;
    }

    return (
        <main className={style({ padding: "1.25em" })}>
            <h2 className={style({ paddingBottom: "0.5em" })}>
                <Link to={link(":bookId", { bookId: bookHandle })}>
                    {book.title}
                </Link>
            </h2>
            <Suspense>
                {BookPageRoute.get(path, { bookId: bookHandle })}
            </Suspense>
        </main>
    );
};
