import { $note, type NoteId, type NoteTagString } from "~/entities/note";
import { updateNoteContentsMutation } from "../api";

export const updateNoteContents = async (id: NoteId, contents: string) => {
  const result = await updateNoteContentsMutation(id, contents);

  if (result == null) return null;

  const store = $note(id);
  let loader = store.get();

  if (loader.status === "pending") {
    await loader.promise;
    loader = store.get();
  }

  if (loader.status === "fulfilled" && loader.value != null) {
    store.resolve({
      ...loader.value,
      contents: result.contents,
      tags: result.tags as readonly NoteTagString[],
      updatedAt: result.updatedAt,
    });
  }
};
