import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { type Tag, type TagSymbol, parseTag } from "~/entities/tag";
import { useEditableTags } from "./hook";

describe("useEditableTags", () => {
  test("start / end", () => {
    const { rerender, result } = renderHook(useEditableTags);

    const tags = ["#hoge"] as Tag[];
    {
      const [state, { start }] = result.current;
      expect(state).toBeNull();
      start(tags);
    }

    rerender();

    {
      const [state, { end: _ }] = result.current;
      expect(state).toEqual({ tags: [parseTag("#hoge")] });
      // TODO[+msw]: end("<note-id>" as NoteId, tags);
    }

    // TODO[+msw]: expect(network).not.haveRequest();
  });

  test("upsert / remove", () => {
    const { rerender, result } = renderHook(useEditableTags);

    {
      const [, { start, upsertTag, removeTag }] = result.current;
      start(["#hoge" as Tag, "@piyo:1" as Tag]);
      removeTag("#hoge" as TagSymbol);
      upsertTag("#fuga" as Tag);
      upsertTag("@piyo:2" as Tag);
    }

    rerender();

    expect(result.current[0]).toEqual({
      tags: ["@piyo:2", "#fuga"].map(parseTag),
    });

    // TODO[+msw]: end("<note-id>" as NoteId, tags);
    // TODO[+msw]: expect(network).haveRequest({
    //   removeTags: ["#hoge", "@piyo:1"],
    //   addTags: ["#fuga", "@piyo:2"],
    // });
  });

  // TODO[+msw]: test
  test.todo("編集後に一定時間経過すると自動保存", async () => {
    const { rerender, result } = renderHook(useEditableTags);

    {
      const [, { start, upsertTag }] = result.current;
      start([]);
      upsertTag("#hoge" as Tag);
    }

    rerender();

    await vi.advanceTimersToNextTimerAsync();

    // TODO[+msw]: expect(network).haveRequest({ removeTags: [], addTags: ["#hoge"] });
  });
});
