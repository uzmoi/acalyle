import {
    type InferPath,
    type MatchParams,
    page,
    routes,
} from "@acalyle/router";
import { style } from "@macaron-css/core";
import { Suspense } from "react";
import type { Scalars } from "~/__generated__/graphql";
import { MemoListPage } from "~/pages/book/MemoListPage";
import { useBook } from "~/store/hook";
import { Link } from "~/ui/Link";
import { Memo } from "~/ui/Memo";
import { link } from "./link";

export type BookPageRoute = InferPath<typeof BookPageRoute>;

export const BookPageRoute = routes({
    "": page(({ bookId: bookHandle }: MatchParams<"bookId">) => (
        <MemoListPage bookHandle={bookHandle} />
    )),
    resources: page(() => null),
    settings: page(() => null),
    ":memoId": page(({ bookId, memoId }: MatchParams<"bookId" | "memoId">) => (
        <Memo bookHandle={bookId} memoId={memoId as Scalars["ID"]} />
    )),
}).map((children, _, { bookId }) => (
    // eslint-disable-next-line react/jsx-key
    <BookPage bookHandle={bookId}>{children}</BookPage>
));

export const BookPage: React.FC<{
    bookHandle: string;
    children?: React.ReactNode;
}> = ({ bookHandle, children }) => {
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
            <Suspense>{children}</Suspense>
        </main>
    );
};
