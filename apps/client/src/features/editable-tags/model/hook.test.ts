import { NoteTag } from "@acalyle/core";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { NoteTagString } from "~/entities/note";
import { useEditableTags } from "./hook";

describe("useEditableTags", () => {
  test("start / end", () => {
    const { rerender, result } = renderHook(useEditableTags);

    const tags = ["#hoge"] as NoteTagString[];
    {
      const [state, { start }] = result.current;
      expect(state).toBeNull();
      start(tags);
    }

    rerender();

    {
      const [state, { end: _ }] = result.current;
      expect(state).toEqual({ tags: [NoteTag.fromString("#hoge")] });
      // TODO: end("<note-id>" as NoteId, tags);
    }

    // TODO: expect(network).not.haveRequest();
  });

  test("upsert / remove", () => {
    const { rerender, result } = renderHook(useEditableTags);

    {
      const [, { start, upsertTag, removeTag }] = result.current;
      start(["#hoge" as NoteTagString, "@piyo:1" as NoteTagString]);
      removeTag("#hoge");
      upsertTag("#fuga" as NoteTagString);
      upsertTag("@piyo:2" as NoteTagString);
    }

    rerender();

    expect(result.current[0]).toEqual({
      tags: ["@piyo:2", "#fuga"].map(NoteTag.fromString),
    });

    // TODO: end("<note-id>" as NoteId, tags);
    // TODO: expect(network).haveRequest({
    //   removeTags: ["#hoge", "@piyo:1"],
    //   addTags: ["#fuga", "@piyo:2"],
    // });
  });

  test.todo("編集後に一定時間経過すると自動保存", async () => {
    const { rerender, result } = renderHook(useEditableTags);

    {
      const [, { start, upsertTag }] = result.current;
      start([]);
      upsertTag("#hoge" as NoteTagString);
    }

    rerender();

    await vi.advanceTimersToNextTimerAsync();

    // expect(network).haveRequest({ removeTags: [], addTags: ["#hoge"] });
  });
});
