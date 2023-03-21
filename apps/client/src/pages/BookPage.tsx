import * as Router from "@acalyle/router";
import { style } from "@macaron-css/core";
import { Memo } from "~/ui/Memo";
import { MemoList } from "~/ui/MemoList";

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
    return (
        <main className={style({ padding: "2em" })}>
            {BookPageRoute.get(path, { bookId })}
        </main>
    );
};
