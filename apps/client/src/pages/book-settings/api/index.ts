import { acalyle } from "~/app/main";
import type { BookId, BookHandle } from "~/entities/book";
import type { ID } from "~/shared/graphql";
import ChangeBookDescriptionMutation from "./change-book-description.graphql";
import ChangeBookHandleMutation from "./change-book-handle.graphql";
import ChangeBookTitleMutation from "./change-book-title.graphql";

export const changeBookTitleMutation = async (
  id: BookId,
  title: string,
): Promise<boolean> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookTitleMutation, {
    bookId: id as string as ID,
    title,
  });

  const book = data.updateBookTitle;

  return book != null;
};

export const changeBookHandleMutation = async (
  id: BookId,
  handle: BookHandle | null,
): Promise<boolean> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookHandleMutation, {
    bookId: id as string as ID,
    handle,
  });

  const book = data.updateBookHandle;

  return book != null;
};

export const changeBookDescriptionMutation = async (
  id: BookId,
  description: string,
): Promise<boolean> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookDescriptionMutation, {
    bookId: id as string as ID,
    description,
  });

  const book = data.updateBookDescription;

  return book != null;
};
