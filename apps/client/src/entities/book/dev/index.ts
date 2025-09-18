// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import type { Book, BookId, BookHandle } from "../model";

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

  return { id, title, handle, description, thumbnail, tags: [] };
};
