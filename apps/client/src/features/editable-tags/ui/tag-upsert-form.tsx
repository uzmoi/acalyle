import { NoteTag, type TagSymbol } from "@acalyle/core";
import { Form, List, TextInput } from "@acalyle/ui";
import { nonNullable } from "emnorst";
import { useState } from "react";
import { type BookRef, useBookByRef } from "~/entities/book";
import { type NoteId, type NoteTagString, useNote } from "~/entities/note";
import { complementNoteTag } from "../model";

export const TagUpsertForm: React.FC<{
  bookRef: BookRef;
  noteId: NoteId;
  onUpsert?: (tag: NoteTagString) => void;
}> = ({ bookRef, noteId, onUpsert }) => {
  const [tag, setTag] = useState("");

  const book = useBookByRef(bookRef);
  const note = useNote(noteId);
  if (book == null || note == null) return null;

  const candidate = complementNoteTag(tag, {
    // 補完から除外するタグを指定。propがあるタグは書き換えをする可能性があるので含めない（==補完に含める）
    tagsOnTargetNote: new Set(
      note.tags
        .map(NoteTag.fromString)
        .filter(nonNullable)
        .filter(tag => tag.prop == null)
        .map(tag => tag.symbol),
    ),
    tagSymbolsInBook: book.tags as readonly TagSymbol[],
  });

  return (
    // TODO: react-selectとか使う
    <Form>
      <TextInput
        value={tag}
        onValueChange={setTag}
        onBlur={() => onUpsert?.(tag as NoteTagString)}
      />
      <List role="listbox">
        {candidate.map((candidate, index) => (
          <List.Item key={index} role="option" data-value={candidate}>
            {candidate}
          </List.Item>
        ))}
      </List>
    </Form>
  );
};
