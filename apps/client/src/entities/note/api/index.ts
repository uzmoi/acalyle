import { acalyle } from "~/app/main";
import type { ID } from "~/shared/graphql";
import type { Note, NoteId, NoteTagString } from "../model";
import NoteQuery from "./note.graphql";

export const fetchNote = async (id: NoteId): Promise<Note | null> => {
  const gql = acalyle.net.gql.bind(acalyle.net);
  const { data } = await gql(NoteQuery, { noteId: id as string as ID });
  const note = data?.memo;
  if (note == null) return null;

  return {
    id: note.id as string as NoteId,
    contents: note.contents,
    tags: note.tags as NoteTagString[],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
};
