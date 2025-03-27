import { acalyle } from "~/app/main";
import { $book, type BookHandle, type BookId } from "~/entities/book";
import { toPromise } from "~/lib/promise-loader";
import type { ID } from "~/shared/graphql";
import ChangeBookDescriptionMutation from "../api/change-book-description.graphql";
import ChangeBookHandleMutation from "../api/change-book-handle.graphql";
import ChangeBookTitleMutation from "../api/change-book-title.graphql";

export const changeBookTitle = async (
  id: BookId,
  title: string,
): Promise<void> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookTitleMutation, {
    bookId: id as string as ID,
    title,
  });

  const book = data.updateBookTitle;

  if (book == null) return;

  const store = $book(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({
      ...value,
      title: book.title,
    });
  }
};

export const changeBookHandle = async (
  id: BookId,
  handle: string | null,
): Promise<void> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookHandleMutation, {
    bookId: id as string as ID,
    handle,
  });

  const book = data.updateBookHandle;

  if (book == null) return;

  const store = $book(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({
      ...value,
      handle: book.handle as BookHandle | null,
    });
  }
};

export const changeBookDescription = async (
  id: BookId,
  description: string,
): Promise<void> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookDescriptionMutation, {
    bookId: id as string as ID,
    description,
  });

  const book = data.updateBookDescription;

  if (book == null) return;

  const store = $book(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({
      ...value,
      description: book.description,
    });
  }
};
