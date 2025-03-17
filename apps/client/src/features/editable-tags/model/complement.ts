import type { TagSymbol } from "@acalyle/core";

export interface NoteTagComplementContext {
  tagsOnTargetNote: ReadonlySet<TagSymbol>;
  tagSymbolsInBook: readonly TagSymbol[];
}

export const complementNoteTag = (
  input: string,
  context: NoteTagComplementContext,
): string[] => {
  return context.tagSymbolsInBook
    .filter(symbol => !context.tagsOnTargetNote.has(symbol))
    .filter(symbol => symbol.includes(input));
};
