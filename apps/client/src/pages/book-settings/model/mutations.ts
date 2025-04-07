import { $book, type BookHandle, type BookId } from "~/entities/book";
import { toPromise } from "~/lib/promise-loader";
import {
  changeBookDescriptionMutation,
  changeBookHandleMutation,
  changeBookTitleMutation,
} from "../api";

export const changeBookTitle = async (
  id: BookId,
  title: string,
): Promise<void> => {
  const result = await changeBookTitleMutation(id, title);
  if (!result.ok) return;

  const store = $book(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({ ...value, title });
  }
};

export const changeBookHandle = async (
  id: BookId,
  handle: BookHandle | null,
): Promise<void> => {
  const result = await changeBookHandleMutation(id, handle);
  if (!result.ok) return;

  const store = $book(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({ ...value, handle });
  }
};

export const changeBookDescription = async (
  id: BookId,
  description: string,
): Promise<void> => {
  const result = await changeBookDescriptionMutation(id, description);
  if (!result.ok) return;

  const store = $book(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({ ...value, description });
  }
};
