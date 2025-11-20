import { faker } from "@faker-js/faker";
import { expect, userEvent } from "storybook/test";
import preview from "~/../.storybook/preview";
import { NewBookPage } from "./page";

const meta = preview.meta({
  component: NewBookPage,
  parameters: { layout: "fullscreen" },
});

export const Default = meta.story({});

export const Filled = meta.story({
  async play({ canvas }) {
    await userEvent.type(canvas.getByLabelText(/Title/), faker.book.title());
    await userEvent.type(
      canvas.getByLabelText("Description"),
      faker.lorem.sentence(),
    );
  },
});

export const Invalid = meta.story({
  async play({ canvas }) {
    await userEvent.type(canvas.getByLabelText(/Title/), faker.book.title());

    const descriptionInputEl = canvas.getByLabelText("Description");
    await userEvent.click(descriptionInputEl);
    await userEvent.paste(`${"a".repeat(500 - 1)}𩇔`); // <- surrogate pair character
    await expect(descriptionInputEl).toBeValid();
    await userEvent.keyboard("b");
    await expect(descriptionInputEl).not.toBeValid();
  },
});
