import { Err, Ok, Result } from "@uzmoi/ut/fp";
import type { NoteId, NoteTagString } from "~/entities/note";
import { gql, type ID, type GqlFnError } from "~/shared/graphql";
import UpdateNoteContentsMutation from "./update-note-contents.graphql";

export interface UpdateNoteContentsMutationResult {
  contents: string;
  tags: readonly NoteTagString[];
  updatedAt: string;
}

export const updateNoteContentsMutation = async (
  id: NoteId,
  contents: string,
): Promise<Result<UpdateNoteContentsMutationResult, GqlFnError>> => {
  const result = await gql(UpdateNoteContentsMutation, {
    noteId: id as string as ID,
    contents,
  });

  if (!result.ok) return result;
  const note = result.value.updateMemoContents;

  if (note == null) {
    return Err({ name: "NotFoundError" });
  }

  return Ok({
    contents: note.contents,
    tags: note.tags as NoteTagString[],
    updatedAt: note.updatedAt,
  });
};
