import { gql, type ID } from "~/shared/graphql";
import type { Note, NoteId, NoteTagString } from "../model";
import NoteQuery from "./note.graphql";

export const fetchNote = async (id: NoteId): Promise<Note | null> => {
  const result = await gql(NoteQuery, { noteId: id as string as ID });
  const note = result.getOrThrow().memo;

  if (note == null) return null;

  return {
    id: note.id as string as NoteId,
    contents: note.contents,
    tags: note.tags as NoteTagString[],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};
