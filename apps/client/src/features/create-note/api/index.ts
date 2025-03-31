import { acalyle } from "~/app/main";
import type { BookId } from "~/entities/book";
import type { ID } from "~/shared/graphql";
import NoteTemplateQuery from "./note-template.graphql";

export const fetchTemplate = async (
  bookId: BookId,
): Promise<readonly string[]> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(NoteTemplateQuery, {
    bookId: bookId as string as ID,
  });

  return data.book?.tagProps ?? [];
};
