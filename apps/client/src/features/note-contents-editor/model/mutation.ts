import { $note, type NoteId, type NoteTagString } from "~/entities/note";
import { toPromise } from "~/lib/promise-loader";
import { updateNoteContentsMutation } from "../api";

export const updateNoteContents = async (
  id: NoteId,
  contents: string,
): Promise<void> => {
  const result = await updateNoteContentsMutation(id, contents);

  if (result == null) return;

  const store = $note(id);
  const value = await toPromise(store);
  if (value != null) {
    store.resolve({
      ...value,
      contents: result.contents,
      tags: result.tags as readonly NoteTagString[],
      updatedAt: result.updatedAt,
    });
  }
};
