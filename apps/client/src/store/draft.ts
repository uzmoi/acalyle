import { Idb, IdbSchema } from "@acalyle/idb";
import type { Scalars } from "~/__generated__/graphql";

const draftDBSchema = new IdbSchema("draft", 1, {
    "note-draft": IdbSchema.objectStore<NoteDraft>({
        keyPath: "noteId",
    }),
});

export type NoteDraft = {
    noteId: string;
    contentsBeforeEditing: string;
    contents: string;
};

export const loadNoteDraft = async (
    noteId: Scalars["ID"],
): Promise<NoteDraft | undefined> => {
    const db = await Idb.open(draftDBSchema);
    const tx = db.transaction("note-draft");
    const store = tx.objectStore("note-draft");
    const draft = await store.get(noteId);
    db.close();
    return draft;
};

export const saveNoteDraft = async (
    noteId: Scalars["ID"],
    contentsBeforeEditing: string,
    editedContents: string,
) => {
    const db = await Idb.open(draftDBSchema);
    const tx = db.transaction("note-draft", "readwrite");
    const store = tx.objectStore("note-draft");
    await store.put({
        noteId: noteId,
        contentsBeforeEditing,
        contents: editedContents,
    });
    db.close();
};

export const removeNoteDraft = async (noteId: Scalars["ID"]) => {
    const db = await Idb.open(draftDBSchema);
    const tx = db.transaction("note-draft", "readwrite");
    const store = tx.objectStore("note-draft");
    await store.delete(noteId);
    db.close();
};
