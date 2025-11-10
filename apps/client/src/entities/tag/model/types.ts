import type { Brand, NoBrand } from "@uzmoi/ut/types";

declare module "~/shared/utils" {
  interface RegisterRebrand {
    ["string->Tag"](input: string & NoBrand): Tag;
  }
}

export type Tag = string & Brand<"Tag">;

export type TagSymbol = Tag & Brand<"TagSymbol">;

export interface TagObject {
  symbol: TagSymbol;
  prop: string | undefined;
}

export interface TagStyle {
  fg: string;
  bg: string;
  outline: string;
}

export interface TagMetadata {
  symbol: TagSymbol;
  props: Set<string>;
  description: string;
}
