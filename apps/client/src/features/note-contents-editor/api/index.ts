import { Result } from "@acalyle/fp";
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

  return result.flatMap(data => {
    if (data.updateMemoContents == null) {
      return Result.err({ name: "NotFoundError" });
    }
    const { contents, tags, updatedAt } = data.updateMemoContents;
    return Result.ok({ contents, tags: tags as NoteTagString[], updatedAt });
  });
};
