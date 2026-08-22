import type { Book, BookHandle, BookId } from "#/entities/book";
import type { Note, NoteId } from "#/entities/note";
import type { Tag } from "#/entities/tag";

export const dummyBookId = "B0000000000000000" as BookId;
export const dummyNote: Note = {
  id: "N0000000000000000" as NoteId,
  contents: "ほげほげふがふが。",
  tags: ["#tag" as Tag],
  createdAt: "1970-01-01T00:00:00Z",
  updatedAt: "1970-01-01T00:00:00Z",
};

export const dummyBooks: readonly Book[] = [
  {
    id: dummyBookId,
    handle: "handle" as BookHandle,
    title: "Title",
    description: "This is a description.",
    thumbnail: "color:#ffffff",
  },
];

export const PREVIEW_PAGES = ["note", "bool-shelf"] as const;

export type PreviewPage = (typeof PREVIEW_PAGES)[number];
