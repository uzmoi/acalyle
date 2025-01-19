import { acalyle } from "~/app/main";
import { bookStore } from "~/book/store/book";
import type { Book, BookId } from "~/entities/book";
import type { ID } from "~/lib/graphql";
import ChangeBookDescriptionMutation from "../api/change-book-description.graphql";
import ChangeBookHandleMutation from "../api/change-book-handle.graphql";
import ChangeBookTitleMutation from "../api/change-book-title.graphql";

const set = async (id: BookId, fields: Partial<Omit<Book, "id">>) => {
  const store = bookStore(id as string as ID);

  let loader = store.get();

  if (loader.status === "pending") {
    await loader.promise;
    loader = store.get();
  }

  if (loader.status === "fulfilled" && loader.value != null) {
    store.resolve({ ...loader.value, ...fields });
  }
};

export const changeBookTitle = async (id: BookId, title: string) => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookTitleMutation, {
    bookId: id as string as ID,
    title,
  });

  const book = data.updateBookTitle;

  if (book == null) return;

  await set(id, { title: book.title });
};

export const changeBookHandle = async (id: BookId, handle: string | null) => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookHandleMutation, {
    bookId: id as string as ID,
    handle,
  });

  const book = data.updateBookHandle;

  if (book == null) return;

  await set(id, { handle: book.handle });
};

export const changeBookDescription = async (
  id: BookId,
  description: string,
) => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(ChangeBookDescriptionMutation, {
    bookId: id as string as ID,
    description,
  });

  const book = data.updateBookDescription;

  if (book == null) return;

  await set(id, { description: book.description });
};
