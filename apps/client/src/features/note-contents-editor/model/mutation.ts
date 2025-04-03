import { $note, type NoteId } from "~/entities/note";
import { toPromise } from "~/lib/promise-loader";
import { updateNoteContentsMutation } from "../api";

export const updateNoteContents = async (
  id: NoteId,
  contents: string,
): Promise<void> => {
  const result = await updateNoteContentsMutation(id, contents);
  if (result.isErr()) return;

  const store = $note(id);
  const value = await toPromise(store);
  if (value != null) {
    const { contents, tags, updatedAt } = result.getOrThrow();
    store.resolve({ ...value, contents, tags, updatedAt });
  }
};
