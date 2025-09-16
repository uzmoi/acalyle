import type { NoteId } from "~/entities/note";
import { removeNoteMutation } from "../api";

export const removeNote = async (
  noteIds: readonly NoteId[],
): Promise<boolean> => {
  const result = await removeNoteMutation(noteIds);
  return result.ok;
};
