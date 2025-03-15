import type { NoteTagString } from "~/entities/note";

export interface TagsDiff {
  added: readonly NoteTagString[];
  removed: readonly NoteTagString[];
}

export const tagsDiff = (
  base: readonly NoteTagString[],
  modified: readonly NoteTagString[],
): TagsDiff => {
  return {
    removed: base.filter(tag => !modified.includes(tag)),
    added: modified.filter(tag => !base.includes(tag)),
  };
};
