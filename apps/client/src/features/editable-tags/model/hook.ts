import { NoteTag } from "@acalyle/core";
import { nonNullable } from "emnorst";
import { useReducer } from "react";
import type { NoteId } from "~/entities/note";
import type { Tag, TagSymbol } from "~/entities/tag";
import { updateNoteTagsMutation } from "../api";
import { tagsDiff } from "./diff";

export interface State {
  tags: readonly NoteTag[];
}

export type Action =
  | { type: "start"; tags: readonly Tag[] }
  | { type: "end" }
  | { type: "upsert"; tag: Tag }
  | { type: "remove"; tag: TagSymbol };

const reducer = (state: State | null, action: Action): State | null => {
  switch (action.type) {
    case "start": {
      return {
        tags: action.tags.map(NoteTag.fromString).filter(nonNullable),
      };
    }
    case "end": {
      return null;
    }
    case "upsert": {
      if (state == null) return null;
      const newTag = NoteTag.fromString(action.tag);
      if (newTag == null) return state;
      const index = state.tags.findIndex(tag => tag.symbol === newTag.symbol);
      return {
        tags:
          index === -1 ?
            [...state.tags, newTag]
          : state.tags.with(index, newTag),
      };
    }
    case "remove": {
      if (state == null) return null;
      return {
        tags: state.tags.filter(tag => tag.symbol !== action.tag),
      };
    }
    // No Default: Returned in all cases.
  }
};

interface EditableTagsOps {
  start: (tags: readonly Tag[]) => void;
  end: (noteId: NoteId, tags: readonly Tag[]) => void;
  upsertTag: (tag: Tag) => void;
  removeTag: (tag: TagSymbol) => void;
}

export const useEditableTags = (): readonly [State | null, EditableTagsOps] => {
  const [state, dispatch] = useReducer(reducer, null);

  return [
    state,
    {
      start(tags) {
        dispatch({ type: "start", tags });
      },
      end(noteId, tags) {
        dispatch({ type: "end" });
        if (state != null) {
          const modifiedTags = state.tags.map(tag => tag.toString() as Tag);
          void updateNoteTagsMutation(noteId, tagsDiff(tags, modifiedTags));
        }
      },
      upsertTag(tag) {
        dispatch({ type: "upsert", tag });
      },
      removeTag(tag) {
        dispatch({ type: "remove", tag });
      },
    },
  ] as const;
};
