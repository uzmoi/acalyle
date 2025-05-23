import { Err, Ok, type Result } from "@acalyle/fp";
import type { NoteId, NoteTagString } from "~/entities/note";
import { gql, type ID, type GqlFnError } from "~/shared/graphql";
import type { TagsDiff } from "../model";
import UpdateNoteTagsMutation from "./update-note-tags.graphql";

export const updateNoteTagsMutation = async (
  id: NoteId,
  diff: TagsDiff,
): Promise<Result<readonly NoteTagString[], GqlFnError>> => {
  const result = await gql(UpdateNoteTagsMutation, {
    noteId: id as string as ID,
    // nitrogqlが吐くinputの配列の型定義がreadonlyになっていないので
    addTags: [...diff.added],
    removeTags: [...diff.removed],
  });

  return result.flatMap(result => {
    const note = result.addMemoTags[0];

    if (note == null) {
      return Err({ name: "NotFoundError" } as const);
    }

    return Ok(note.tags as NoteTagString[]);
  });
};
