import { debounce } from "es-toolkit";
import { $note, type NoteId } from "#/entities/note";
import { toPromise } from "~/lib/promise-loader";
import { updateNoteContentsMutation } from "../api";

const updateNoteContents = async (
  id: NoteId,
  contents: string,
): Promise<void> => {
  const result = await updateNoteContentsMutation(id, contents);
  if (!result.ok) {
    throw new Error(`GqlError: ${result.value.name}`, { cause: result.value });
  }

  const store = $note(id);
  const value = await toPromise(store);
  if (value != null) {
    const { contents, tags, updatedAt } = result.value;
    store.resolve({ ...value, contents, tags, updatedAt });
  }
};

const SAVE_DEBOUNCE_TIME = 1000;

export const saveNoteContents = debounce((noteId: NoteId, contents: string) => {
  void updateNoteContents(noteId, contents);
}, SAVE_DEBOUNCE_TIME);
