import { acalyle } from "~/app/main";
import { $book, type BookId, type BookRef } from "~/entities/book";
import CreateBookMutation from "../api/create-book.graphql";

export const createBook = async (
  title: string,
  description: string,
): Promise<BookRef> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(CreateBookMutation, {
    title,
    description,
    // { "variables.thumbnail": thumbnail },
  });

  const bookId = data.createBook.id as string as BookId;

  $book(bookId).resolve({
    id: bookId,
    handle: null,
    title,
    description,
    tags: [],
    thumbnail: data.createBook.thumbnail,
  });

  return bookId;
};
