import type { Brand } from "@uzmoi/ut/types";

interface NoBrand {
  "__?+brand"?: undefined;
  "__?-brand"?: undefined;
}

declare module "~/shared/utils" {
  interface RegisterRebrand {
    ["string->Tag"](input: string & NoBrand): Tag;
  }
}

export type Tag = string & Brand<"Tag">;

export type TagSymbol = Tag & Brand<"TagSymbol">;

export interface TagMetadata {
  symbol: TagSymbol;
  props: Set<string>;
  description: string;
}
