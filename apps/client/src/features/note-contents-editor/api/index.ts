import { acalyle } from "~/app/main";
import type { NoteId } from "~/entities/note";
import type { ID } from "~/shared/graphql";
import UpdateNoteContentsMutation from "./update-note-contents.graphql";

export interface UpdateNoteContentsMutationResult {
  contents: string;
  tags: readonly string[];
  updatedAt: string;
}

export const updateNoteContentsMutation = async (
  id: NoteId,
  contents: string,
): Promise<UpdateNoteContentsMutationResult | null> => {
  const gql = acalyle.net.gql.bind(acalyle.net);

  const { data } = await gql(UpdateNoteContentsMutation, {
    noteId: id as string as ID,
    contents,
  });

  return data.updateMemoContents;
};
