import { use } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Link } from "#shared/ui";
import type { BooksPage as IBooksPage } from "../api";
import { BookShelf } from "./shelf";

export const BooksPage: React.FC<{
  query: string | undefined;
  fetchingPage: Promise<IBooksPage>;
}> = ({ query, fetchingPage }) => {
  const { books, pageInfo } = use(fetchingPage);

  return (
    <div>
      <BookShelf books={books} />
      <div className=":uno: mt flex justify-between b-t b-t-gray-7 b-t-solid pt-1">
        <Link
          to="/books"
          search={{ query, before: pageInfo.startCursor ?? undefined }}
          disabled={!pageInfo.hasPreviousPage}
        >
          <BiChevronLeft />
          <span className=":uno: ml-1">Prev</span>
        </Link>
        <Link
          to="/books"
          search={{ query, after: pageInfo.endCursor ?? undefined }}
          disabled={!pageInfo.hasNextPage}
        >
          <span className=":uno: mr-1">Next</span>
          <BiChevronRight />
        </Link>
      </div>
    </div>
  );
};
