import { acalyle } from "~/app/main";
import type { BookId, Book } from "~/entities/book";
import CreateBookMutation from "./create-book.graphql";

export const createBookMutation = async (
  title: string,
  description: string,
): Promise<Book> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(CreateBookMutation, {
    title,
    description,
    // { "variables.thumbnail": thumbnail },
  });

  return {
    id: data.createBook.id as string as BookId,
    handle: null,
    title,
    description,
    tags: [],
    thumbnail: data.createBook.thumbnail,
  };
};
