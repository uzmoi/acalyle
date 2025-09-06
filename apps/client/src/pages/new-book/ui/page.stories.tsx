import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "@storybook/test";
import { NewBookPage } from "./page";

const meta = {
  component: NewBookPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NewBookPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  async play({ canvas }) {
    await userEvent.type(
      canvas.getByLabelText("Book title", { exact: false }),
      faker.book.title(),
    );
    await userEvent.type(
      canvas.getByLabelText("Description"),
      faker.lorem.sentence(),
    );
  },
};

export const Invalid: Story = {
  async play({ canvas }) {
    await userEvent.type(
      canvas.getByLabelText("Book title", { exact: false }),
      faker.book.title(),
    );

    const descriptionInputEl = canvas.getByLabelText("Description");
    await userEvent.click(descriptionInputEl);
    await userEvent.paste("a".repeat(500));
    await expect(descriptionInputEl).toHaveAttribute("aria-invalid", "false");
    await userEvent.keyboard("b");
    await expect(descriptionInputEl).toHaveAttribute("aria-invalid", "true");
  },
};
