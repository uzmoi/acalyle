import type { BookHandle, BookId } from "~/entities/book";
import {
  changeBookDescriptionMutation,
  changeBookHandleMutation,
  changeBookTitleMutation,
} from "../api";

export const changeBookTitle = async (
  id: BookId,
  title: string,
): Promise<void> => {
  await changeBookTitleMutation(id, title);
};

export const changeBookHandle = async (
  id: BookId,
  handle: BookHandle | null,
): Promise<void> => {
  await changeBookHandleMutation(id, handle);
};

export const changeBookDescription = async (
  id: BookId,
  description: string,
): Promise<void> => {
  await changeBookDescriptionMutation(id, description);
};
