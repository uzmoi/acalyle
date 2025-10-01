import type { Brand } from "@uzmoi/ut/types";
import type { Tag } from "~/entities/tag";
import type { ID } from "~/shared/graphql";

declare module "~/shared/utils" {
  interface RegisterRebrand {
    ["ID->NoteId"](input: ID): NoteId;
    ["NoteId->ID"](input: NoteId): ID;
  }
}

export type NoteId = string & Brand<"NoteId">;

export interface Note {
  id: NoteId;
  contents: string;
  tags: readonly Tag[];
  createdAt: string;
  updatedAt: string;
}
