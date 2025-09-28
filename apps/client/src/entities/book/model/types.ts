import type { TagSymbol } from "@acalyle/core";
import type { Brand } from "@uzmoi/ut/types";

export type BookId = string & Brand<"BookId">;

export type BookHandle = string & Brand<"BookHandle">;

export interface Book {
  id: BookId;
  handle: BookHandle | null;
  title: string;
  description: string;
  thumbnail: string;
}

export interface BookDetail {
  createdAt: string;
  tags: Map<TagSymbol, NoteTagMetadata>;
}

export interface NoteTagMetadata {
  symbol: TagSymbol;
  props: Set<string>;
  description: string;
}
