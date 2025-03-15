import type { Brand } from "@uzmoi/ut/types";

export type BookId = string & Brand<"BookId">;

export type BookHandle = string & Brand<"BookHandle">;

export interface Book {
  id: BookId;
  handle: BookHandle | null;
  title: string;
  description: string;
  thumbnail: string;
  tags: readonly string[];
}
