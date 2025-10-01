import type { Brand } from "@uzmoi/ut/types";
import type { TagMetadata, TagSymbol } from "~/entities/tag";
import type { ID } from "~/shared/graphql";

interface NoBrand {
  "__?+brand"?: undefined;
  "__?-brand"?: undefined;
}

declare module "~/shared/utils" {
  interface RegisterRebrand {
    ["BookId->ID"](input: BookId): ID;
    ["ID->BookId"](input: ID): BookId;
    ["string->BookHandle"](input: string & NoBrand): BookHandle;
  }
}

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
  tags: Map<TagSymbol, TagMetadata>;
}
