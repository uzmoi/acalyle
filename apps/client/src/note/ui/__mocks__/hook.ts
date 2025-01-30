import type { ID } from "~/lib/graphql";
import type { Note } from "../../store";

export const getNote = (noteId: ID): Note => ({
    id: noteId,
    contents: "contents\nhogehoge",
    tags: ["#tagA", "#tagB"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});

export const useNote = (noteId: ID): Note => getNote(noteId);
