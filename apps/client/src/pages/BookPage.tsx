import * as Router from "@acalyle/router";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { bookStore } from "~/store/book";
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
    "": Router.page(params => <MemoList bookId={params.bookId} />),
    resources: Router.page(() => null),
    settings: Router.page(() => null),
    ":memoId": Router.page(params => <Memo memoId={params.memoId} />),
});

export const BookPage: React.FC<{
    bookId: string;
    path: readonly string[];
}> = ({ bookId, path }) => {
    const book = useStore(bookStore(bookId));

    if (book == null) {
        return null;
    }

    return (
        <main className={style({ padding: "2em" })}>
            <h2 className={style({ paddingBottom: "0.5em" })}>
                <Link to={link(":bookId", { bookId })}>{book.title}</Link>
            </h2>
            {BookPageRoute.get(path, { bookId })}
        </main>
    );
};
