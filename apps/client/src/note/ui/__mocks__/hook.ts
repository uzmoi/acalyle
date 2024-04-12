import type { ID } from "~/__generated__/graphql";
import type { Note } from "../../store";

export const useNote = (noteId: ID): Note => {
    return {
        id: noteId,
        contents: "contents\nhogehoge",
        tags: ["#tagA", "#tagB"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};
