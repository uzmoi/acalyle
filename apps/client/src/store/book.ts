import { gql } from "graphql-tag";
import type {
    GqlBookQuery,
    GqlBookQueryVariables,
    GqlCreateBookMutation,
    GqlCreateBookMutationVariables,
} from "~/__generated__/graphql";
import { createQueryStore } from "~/lib/query-store";
import type { Book } from "./book-connection";
import { net } from "./net";

const BookQuery = gql`
    query Book($bookId: ID!) {
        book(id: $bookId) {
            id
            handle
            title
            description
            thumbnail
            createdAt
            tags
        }
    }
`;

export const bookStore = createQueryStore(
    async (bookId: string): Promise<Book | null> => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { graphql } = net.get()!;
        const { data } = await graphql<GqlBookQuery, GqlBookQueryVariables>(
            BookQuery,
            { bookId },
        );
        return data.book
            ? { ...data.book, handle: data.book.handle ?? null }
            : null;
    },
);

const CreateBookMutation = gql`
    mutation CreateBook(
        $title: String!
        $description: String!
        $thumbnail: Upload
    ) {
        createBook(
            title: $title
            description: $description
            thumbnail: $thumbnail
        ) {
            id
            handle
            title
            description
            thumbnail
            createdAt
        }
    }
`;

export const createBook = async (title: string, description: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlCreateBookMutation,
        GqlCreateBookMutationVariables
    >(
        CreateBookMutation,
        { title, description, thumbnail: null },
        // { "variables.thumbnail": thumbnail },
    );
    const book = data.createBook;
    bookStore(book.id).resolve({
        ...book,
        handle: book.handle ?? null,
        tags: [],
    });
    return book;
};
