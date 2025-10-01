import { Err, Ok, type Result } from "@uzmoi/ut/fp";
import type { NoteId } from "~/entities/note";
import type { Tag } from "~/entities/tag";
import { type GqlFnError, gql } from "~/shared/graphql";
import { rebrand } from "~/shared/utils";
import type { TagsDiff } from "../model";
import UpdateNoteTagsMutation from "./update-note-tags.graphql";

export const updateNoteTagsMutation = async (
  id: NoteId,
  diff: TagsDiff,
): Promise<Result<readonly Tag[], GqlFnError>> => {
  const result = await gql(UpdateNoteTagsMutation, {
    noteId: rebrand(id),
    // nitrogqlが吐くinputの配列の型定義がreadonlyになっていないので
    addTags: [...diff.added],
    removeTags: [...diff.removed],
  });

  if (!result.ok) return result;
  const [note] = result.value.addMemoTags;

  if (note == null) {
    return Err({ name: "NotFoundError" });
  }

  return Ok(rebrand<Tag[]>(note.tags));
};
