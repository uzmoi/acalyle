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
import { BookHeader } from "~/ui/book/BookHeader";
import { Note } from "~/ui/note/Note";

export type BookPageRoute = InferPath<typeof BookPageRoute>;

/* eslint-disable acalyle/no-module-side-effect */
export const BookPageRoute = routes({
    "": page(({ bookId: bookHandle }: MatchParams<"bookId">) => (
        <MemoListPage bookHandle={bookHandle} />
    )),
    resources: page(() => null),
    settings: page(() => null),
    ":memoId": page(({ bookId, memoId }: MatchParams<"bookId" | "memoId">) => (
        <Note book={bookId} noteId={memoId as Scalars["ID"]} />
    )),
}).map((children, _, { bookId }) => (
    // eslint-disable-next-line react/jsx-key
    <BookPage bookHandle={bookId}>{children}</BookPage>
));
/* eslint-enable acalyle/no-module-side-effect */

export const BookPage: React.FC<{
    bookHandle: string;
    children?: React.ReactNode;
}> = ({ bookHandle, children }) => {
    return (
        <main className={style({ padding: "1.25em" })}>
            <BookHeader book={bookHandle} />
            <Suspense>{children}</Suspense>
        </main>
    );
};
