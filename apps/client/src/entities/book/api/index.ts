import { acalyle } from "~/app/main";
import type { ID } from "~/shared/graphql";
import type { Book, BookHandle, BookId } from "../model";
import BookQuery from "./book.graphql";

export const fetchBook = async (id: BookId): Promise<Book | null> => {
  const gql = acalyle.net.gql.bind(acalyle.net);
  const { data } = await gql(BookQuery, { bookId: id as string as ID });
  const book = data?.book;
  if (book == null) return null;

  return {
    id: book.id as string as BookId,
    handle: book.handle as BookHandle | null,
    title: book.title,
    description: book.description,
    thumbnail: book.thumbnail,
    tags: book.tags,
  };
};

export const fetchBookByHandle = async (
  handle: BookHandle,
): Promise<Book | null> => {
  const gql = acalyle.net.gql.bind(acalyle.net);
  const { data } = await gql(BookQuery, { handle });
  const book = data?.book;
  if (book == null) return null;

  return {
    id: book.id as string as BookId,
    handle: book.handle as BookHandle | null,
    title: book.title,
    description: book.description,
    thumbnail: book.thumbnail,
    tags: book.tags,
  };
};
