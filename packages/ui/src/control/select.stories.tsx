import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./select";

const options = ["hoge", "fuga", "piyo"];

export default {
    title: "Control/Select",
    component: Select,
    render: props => (
        <Select {...props}>
            {options.map(option => (
                <Select.Option key={option}>{option}</Select.Option>
            ))}
        </Select>
    ),
} satisfies Meta<typeof Select>;

type Story = StoryObj<typeof Select>;

export const solid: Story = {
    args: {
        variant: "solid",
    },
};

export const outline: Story = {
    args: {
        variant: "outline",
    },
};

export const unstyled: Story = {
    args: {
        variant: "unstyled",
    },
};
