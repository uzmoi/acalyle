import { gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import type { Note, NoteId } from "../model";
import NoteQuery from "./note.graphql";

export const fetchNote = async (id: NoteId): Promise<Note | null> => {
  const result = await gql(NoteQuery, { noteId: rebrand(id) });
  const note = result.unwrap().memo;

  if (note == null) return null;

  return {
    id: rebrand(note.id),
    contents: note.contents,
    tags: rebrand(note.tags),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};
