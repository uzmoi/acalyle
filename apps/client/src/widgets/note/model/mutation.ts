import { $note, type NoteId, type NoteTagString } from "~/entities/note";
import { updateNoteContents } from "../api";

export const update = async (id: NoteId, contents: string) => {
  const result = await updateNoteContents(id, contents);

  if (result == null) return null;

  $note(id).resolve({
    id,
    contents: result.contents,
    tags: result.tags as readonly NoteTagString[],
    createdAt: "1970-01-01T00:00:00Z",
    updatedAt: result.updatedAt,
  });
};
