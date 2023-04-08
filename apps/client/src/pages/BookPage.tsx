import * as Router from "@acalyle/router";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { Suspense } from "react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { bookHandleStore, bookStore, handleBookStore } from "~/store/book";
import { CreateMemoButton } from "~/ui/CreateMemoButton";
import { Link } from "~/ui/Link";
import { Memo } from "~/ui/Memo";
import { MemoList } from "~/ui/MemoList";
import { link } from "./link";

export type BookPageRoute = Router.Routes<{
    "": Router.Page<"bookId">;
    ":memoId": Router.Page;
    resources: Router.Page;
    settings: Router.Page;
}>;

const BookPageRoute = Router.routes<BookPageRoute, JSX.Element | null>({
    "": Router.page(({ bookId }) => (
        <div>
            <div>
                <CreateMemoButton bookId={bookId} />
                {/* <MemoImportButton /> */}
            </div>
            <MemoList bookId={bookId} />
        </div>
    )),
    resources: Router.page(() => null),
    settings: Router.page(() => null),
    ":memoId": Router.page(({ bookId, memoId }) => (
        <Memo bookId={bookId} memoId={memoId} />
    )),
});

export const BookPage: React.FC<{
    bookId: string;
    path: readonly string[];
}> = ({ bookId, path }) => {
    const actualBookId =
        usePromiseLoader(
            useStore(
                bookHandleStore(bookId.startsWith("@") ? bookId.slice(1) : ""),
            ),
        ) ?? bookId;
    const book = usePromiseLoader(
        useStore(
            bookId.startsWith("@")
                ? handleBookStore(bookId.slice(1))
                : bookStore(bookId),
        ),
    );

    if (book == null) {
        return null;
    }

    return (
        <main className={style({ padding: "1.25em" })}>
            <h2 className={style({ paddingBottom: "0.5em" })}>
                <Link to={link(":bookId", { bookId })}>{book.title}</Link>
            </h2>
            <Suspense>
                {BookPageRoute.get(path, { bookId: actualBookId })}
            </Suspense>
        </main>
    );
};
