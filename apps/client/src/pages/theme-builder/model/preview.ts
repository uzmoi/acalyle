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
    handle: "handle1" as BookHandle,
    title: "Book 1",
    description: "This is a description.",
    thumbnail: "color:oklch(0.7 0.2 40)",
  },
  {
    id: "B0000000000000001" as BookId,
    handle: "handle2" as BookHandle,
    title: "Book 2",
    description: "This is a description.",
    thumbnail: "color:oklch(0.7 0.2 130)",
  },
  {
    id: "B0000000000000002" as BookId,
    handle: "handle3" as BookHandle,
    title: "Book 3",
    description: "This is a description.",
    thumbnail: "color:oklch(0.7 0.2 220)",
  },
  {
    id: "B0000000000000003" as BookId,
    handle: "handle4" as BookHandle,
    title: "Book 4",
    description: "This is a description.",
    thumbnail: "color:oklch(0.7 0.2 310)",
  },
];

export const PREVIEW_PAGES = ["note", "bool-shelf"] as const;

export type PreviewPage = (typeof PREVIEW_PAGES)[number];
