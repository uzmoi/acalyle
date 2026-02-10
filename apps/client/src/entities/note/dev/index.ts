import { faker } from "@faker-js/faker";
import type { Tag } from "#entities/tag";
import type { Note, NoteId } from "../model";

/** @public */
export const dummyNote: Note = {
  id: "N0000000000000000" as NoteId,
  contents: "",
  tags: [],
  createdAt: "1970-01-01T00:00:00Z",
  updatedAt: "1970-01-01T00:00:00Z",
};

/** @public */
export const createRandomNote = (): Note => {
  const id = faker.string.nanoid(16) as NoteId;
  const contents = faker.lorem.text();
  const tags = faker.helpers.multiple(() => `#${faker.word.noun()}` as Tag, {
    count: { min: 0, max: 10 },
  });
  const createdAt = faker.date.past().toISOString();
  const updatedAt = faker.date
    .between({ from: createdAt, to: Date.now() })
    .toISOString();

  return { id, contents, tags, createdAt, updatedAt };
};
