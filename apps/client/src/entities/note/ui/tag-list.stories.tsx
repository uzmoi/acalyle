import { style } from "@acalyle/css";
import preview from "~/../.storybook/preview";
import type { Tag } from "~/entities/tag";
import { TagList } from "./tag-list";

const meta = preview.meta({
  title: "Note / TagList",
  component: TagList,
});

export const Tags = meta.story({
  args: {
    tags: ["#tag1", "@tag2", "@tag3:hoge"] as Tag[],
  },
});

export const ManyTags = meta.story({
  args: {
    tags: [
      "#tag1",
      "#tag2",
      "#tag3",
      "#tag4",
      "#tag5",
      "#tag6",
      "#tag7",
      "#tag8",
    ] as Tag[],
    className: style({ width: "24em" }),
  },
});
