// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import type { Note, NoteId, NoteTagString } from "../model";

/** @public */
export const defaultNote: Note = {
  id: "id" as NoteId,
  contents: "contents.\ncontents.",
  tags: ["#tag" as NoteTagString],
  createdAt: "2022-11-06T13:00:00+09:00",
  updatedAt: "2024-11-07T14:55:00+09:00",
};

/** @public */
export const createRandomNote = (): Note => {
  const id = faker.string.nanoid(16) as NoteId;
  const contents = faker.lorem.text();
  const tags = faker.helpers.multiple(
    () => faker.word.noun() as NoteTagString,
    { count: { min: 0, max: 10 } },
  );
  const createdAt = faker.date.past().toISOString();
  const updatedAt = faker.date
    .between({ from: createdAt, to: Date.now() })
    .toISOString();

  return { id, contents, tags, createdAt, updatedAt };
};
