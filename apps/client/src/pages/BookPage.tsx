import { style } from "@acalyle/css";
import {
    type InferPath,
    type MatchParams,
    page,
    routes,
} from "@acalyle/router";
import { Suspense } from "react";
import type { ID } from "~/__generated__/graphql";
import type { BookRef } from "~/book/store";
import { BookHeader } from "~/book/ui/book-header";
import { Note } from "~/note/ui/note";
import { MemoListPage } from "~/pages/book/MemoListPage";
import { BookSettingsPage } from "./book";

export type BookPageRoute = InferPath<typeof BookPageRoute>;

/* eslint-disable pure-module/pure-module */
export const BookPageRoute = routes({
    "": page(({ bookId: bookHandle }: MatchParams<"bookId">) => (
        <MemoListPage bookHandle={bookHandle} />
    )),
    resources: page(() => null),
    settings: page(({ bookId }: MatchParams<"bookId">) => (
        <BookSettingsPage book={bookId} />
    )),
    ":memoId": page(({ bookId, memoId }: MatchParams<"bookId" | "memoId">) => (
        <Note bookRef={bookId as BookRef} noteId={memoId as ID} />
    )),
}).map((children, _, { bookId }) => (
    // eslint-disable-next-line react/jsx-key
    <BookPage bookHandle={bookId}>{children}</BookPage>
));
/* eslint-enable pure-module/pure-module */

export const BookPage: React.FC<{
    bookHandle: string;
    children?: React.ReactNode;
}> = ({ bookHandle, children }) => {
    return (
        <main className={style({ padding: "1.25em" })}>
            <BookHeader bookRef={bookHandle as BookRef} />
            <Suspense>{children}</Suspense>
        </main>
    );
};
