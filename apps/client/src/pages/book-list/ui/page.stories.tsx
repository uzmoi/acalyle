import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { xxHash32 } from "js-xxhash";
import type { Book, BookId, BookHandle } from "~/entities/book";
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
      booksPage: {
        books: faker.helpers.multiple((): Book => {
          const id = faker.string.nanoid(16) as BookId;
          const title = faker.book.title();
          const handle = title
            .toLowerCase()
            .replaceAll(/\W/g, "-") as BookHandle;
          const description = faker.lorem.sentence();
          const thumbnail =
            faker.datatype.boolean() ?
              faker.image.dataUri({ width: 96, height: 96 })
            : `color:${faker.color.lch({ format: "css" })}`;

          return { id, title, handle, description, thumbnail, tags: [] };
        }),
        pageInfo: {},
      },
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  args: {} as any, // oxlint-disable-line no-explicit-any
};
