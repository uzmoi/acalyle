import type { ResultOf } from "@graphql-typed-document-node/core";
import type { Result } from "@uzmoi/ut/fp";
import type { BookId } from "~/entities/book";
import { type Cursor, type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import AfterNotesPageQuery from "./after-notes-page.graphql";
import BeforeNotesPageQuery from "./before-notes-page.graphql";

export type NotePage = NonNullable<
  ResultOf<typeof AfterNotesPageQuery>["book"]
>["memos"];

export const fetchNotePagination = async (
  bookId: BookId,
  cursor: Cursor | null,
  query: string,
  dir: "previous" | "next",
): Promise<Result<NotePage | undefined, GqlFnError>> => {
  const graphqlQuery =
    dir === "previous" ? BeforeNotesPageQuery : AfterNotesPageQuery;

  const result = await gql(graphqlQuery, {
    bookId: rebrand(bookId),
    cursor,
    count: 32,
    query,
  });

  return result.map(({ book }) => book?.memos);
};
