import type { TagSymbol } from "@acalyle/core";
import { Err, Ok, type Result } from "@uzmoi/ut/fp";
import type { BookId } from "~/entities/book";
import type { NoteId, NoteTagString } from "~/entities/note";
import { gql, type ID, type GqlFnError } from "~/shared/graphql";
import type { TagsDiff } from "../model";
import BookTagsQuery from "./book-tags.graphql";
import UpdateNoteTagsMutation from "./update-note-tags.graphql";

export const fetchBookTags = async (
  id: BookId,
): Promise<Result<readonly TagSymbol[] | null, GqlFnError>> => {
  const result = await gql(BookTagsQuery, {
    bookId: id as string as ID,
  });

  if (!result.ok) return result;
  const tags = result.value.book?.tags;

  return Ok((tags as TagSymbol[]) ?? null);
};

export const updateNoteTagsMutation = async (
  id: NoteId,
  diff: TagsDiff,
): Promise<Result<readonly NoteTagString[], GqlFnError>> => {
  const result = await gql(UpdateNoteTagsMutation, {
    noteId: id as string as ID,
    // nitrogqlが吐くinputの配列の型定義がreadonlyになっていないので
    addTags: [...diff.added],
    removeTags: [...diff.removed],
  });

  if (!result.ok) return result;
  const note = result.value.addMemoTags[0];

  if (note == null) {
    return Err({ name: "NotFoundError" });
  }

  return Ok(note.tags as NoteTagString[]);
};
