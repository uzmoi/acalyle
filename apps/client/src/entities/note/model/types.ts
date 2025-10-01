import type { Brand } from "@uzmoi/ut/types";
import type { ID } from "~/shared/graphql";

interface NoBrand {
  "__?+brand"?: undefined;
  "__?-brand"?: undefined;
}

declare module "~/shared/utils" {
  interface RegisterRebrand {
    ["ID->NoteId"](input: ID): NoteId;
    ["NoteId->ID"](input: NoteId): ID;
    ["string->NoteTag"](input: string & NoBrand): NoteTagString;
  }
}

export type NoteId = string & Brand<"NoteId">;

export type NoteTagString = string & Brand<"NoteTag">;

export interface Note {
  id: NoteId;
  contents: string;
  tags: readonly NoteTagString[];
  createdAt: string;
  updatedAt: string;
}
