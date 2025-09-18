import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { xxHash32 } from "js-xxhash";
import { createRandomBook } from "~/entities/book/dev";
import { BookListPage } from "./page";

const meta = {
  component: BookListPage,
  render: (args, { loaded }) => <BookListPage {...args} {...loaded} />,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BookListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  loaders: ({ id }) => {
    faker.seed(xxHash32(id));
    return {
      page: Promise.resolve({
        books: faker.helpers.multiple(() => createRandomBook()),
        pageInfo: {},
      }),
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  args: {} as any, // oxlint-disable-line no-explicit-any
};

export const Loading: Story = {
  args: {
    page: new Promise(() => {}),
  },
};
