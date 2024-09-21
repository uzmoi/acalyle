import { style } from "@acalyle/css";
import type { Meta, StoryObj } from "@storybook/react";
import { TagList } from "./tag-list";

export default {
    title: "Note / TagList",
    component: TagList,
} satisfies Meta<typeof TagList>;

type Story = StoryObj<typeof TagList>;

export const Tags: Story = {
    args: {
        tags: ["#tag1", "@tag2", "@tag3:hoge"],
    },
};

export const ManyTags: Story = {
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
        ],
        className: style({ width: "24em" }),
    },
};
