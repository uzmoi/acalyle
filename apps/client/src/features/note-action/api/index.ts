import type { Result } from "@uzmoi/ut/fp";
import type { NoteId } from "~/entities/note";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import RemoveNoteMutation from "./remove-note.graphql";

export const removeNoteMutation = async (
  noteIds: readonly NoteId[],
): Promise<Result<void, GqlFnError>> => {
  const result = await gql(RemoveNoteMutation, {
    // nitrogqlが吐くinputの配列の型定義がreadonlyになっていないので
    noteIds: [...rebrand(noteIds)],
  });

  return result.map(() => void 0);
};
