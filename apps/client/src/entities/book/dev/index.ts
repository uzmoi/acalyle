/* eslint-disable pure-module/pure-module */
import { faker } from "@faker-js/faker";
import type { Book, BookHandle, BookId } from "../model";

type ValidHandleCharacter =
  | ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9")
  | ("a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j")
  | ("k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t")
  | ("u" | "v" | "w" | "x" | "y" | "z" | "_");

type Handle<T extends string> =
  T extends `${ValidHandleCharacter}${infer Rest}` | "" ? Handle<Rest> : T;

export const handle = <T extends string>(
  handle: string extends T ? never : T & Handle<T>,
): BookHandle => handle as unknown as BookHandle;

/** @public */
export const defaultBook: Book = {
  id: "id" as BookId,
  title: "Title",
  handle: handle("handle"),
  description: "description.",
  thumbnail: "color:gray",
};

/** @public */
export const createRandomBook = (): Book => {
  const id = faker.string.nanoid(16) as BookId;
  const title = faker.book.title();
  const handle = title.toLowerCase().replaceAll(/\W/g, "-") as BookHandle;
  const description = faker.lorem.sentence();
  const thumbnail =
    faker.datatype.boolean() ?
      faker.image.dataUri({ width: 96, height: 96 })
    : `color:${faker.color.lch({ format: "css" })}`;

  return { id, title, handle, description, thumbnail };
};
