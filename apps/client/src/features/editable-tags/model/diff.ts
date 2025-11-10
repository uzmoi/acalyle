import type { Tag } from "~/entities/tag";

export interface TagsDiff {
  added: readonly Tag[];
  removed: readonly Tag[];
}

export const tagsDiff = (
  base: readonly Tag[],
  modified: readonly Tag[],
): TagsDiff => {
  return {
    removed: base.filter(tag => !modified.includes(tag)),
    added: modified.filter(tag => !base.includes(tag)),
  };
};
