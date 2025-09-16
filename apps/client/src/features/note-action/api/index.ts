import type { Result } from "@uzmoi/ut/fp";
import type { NoteId } from "~/entities/note";
import { gql, type GqlFnError, type ID } from "~/shared/graphql";
import RemoveNoteMutation from "./remove-note.graphql";

export const removeNoteMutation = async (
  noteIds: readonly NoteId[],
): Promise<Result<void, GqlFnError>> => {
  const result = await gql(RemoveNoteMutation, {
    noteIds: noteIds as readonly string[] as ID[],
  });

  return result.map(() => void 0);
};
