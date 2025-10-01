import { Err, Ok, type Result } from "@uzmoi/ut/fp";
import type { NoteId, NoteTagString } from "~/entities/note";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
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
    noteId: rebrand(id),
    contents,
  });

  if (!result.ok) return result;
  const note = result.value.updateMemoContents;

  if (note == null) {
    return Err({ name: "NotFoundError" });
  }

  return Ok({
    contents: note.contents,
    tags: rebrand<NoteTagString[]>(note.tags),
    updatedAt: note.updatedAt,
  });
};
