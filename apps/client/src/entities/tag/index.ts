import type { Tag as TagType } from "./model";

/** @public */
export type Tag = TagType;

/** @public */
export {
  type TagMetadata,
  type TagObject,
  type TagSymbol,
  parseTag,
  tagToString,
} from "./model";
/** @public */
export { Tag } from "./ui";
