import type { Brand } from "@uzmoi/ut/types";

export type NoteId = string & Brand<"NoteId">;

export type NoteTagString = string & Brand<"NoteTag">;

export interface Note {
  id: NoteId;
  contents: string;
  tags: readonly NoteTagString[];
  createdAt: string;
  updatedAt: string;
}
