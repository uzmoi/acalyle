import { acalyle } from "~/app/main";
import type { NoteId, NoteTagString } from "~/entities/note";
import type { ID } from "~/shared/graphql";
import type { TagsDiff } from "../model";
import UpdateNoteTagsMutation from "./update-note-tags.graphql";

export const updateNoteTagsMutation = async (
  id: NoteId,
  diff: TagsDiff,
): Promise<readonly NoteTagString[] | null> => {
  const gql = acalyle.net.gql.bind(acalyle.net);
  const { data } = await gql(UpdateNoteTagsMutation, {
    noteId: id as string as ID,
    // nitrogqlが吐くinputの配列の型定義がreadonlyになっていないので
    addTags: [...diff.added],
    removeTags: [...diff.removed],
  });

  const tags = data?.addMemoTags[0]?.tags;
  return (tags ?? null) as readonly NoteTagString[] | null;
};
