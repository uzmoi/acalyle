import type { Tag as TagType } from "./model/types";

/** @public */
export { printTagStyleCss } from "./model/style";
/** @public */
export { parseTag, tagToString } from "./model/tag";
/** @public */
export type { TagObject, TagSymbol, TagMetadata } from "./model/types";

/** @public */
export type Tag = TagType;

/** @public */
export { Tag } from "./ui/tag";
