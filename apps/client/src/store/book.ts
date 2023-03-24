import { gql } from "graphql-tag";
import { type WritableAtom, atom, onMount } from "nanostores";
import type {
    GqlBookQuery,
    GqlBookQueryVariables,
    GqlCreateBookMutation,
    GqlCreateBookMutationVariables,
} from "~/__generated__/graphql";
import type { Book } from "./book-connection";
import { net } from "./net";

const BookQuery = gql`
    query Book($bookId: ID!) {
        book(id: $bookId) {
            id
            title
            description
            thumbnail
            createdAt
        }
    }
`;

const fetchBook = async (bookId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<GqlBookQuery, GqlBookQueryVariables>(
        BookQuery,
        { bookId },
    );
    return data.book ?? null;
};

export const bookStore = (id: string) => {
    if (!bookStore.cache[id]) {
        bookStore.cache[id] = bookStore.build(id);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return bookStore.cache[id]!;
};

bookStore.build = (id: string) => {
    const store = atom<Book | null>(null);
    onMount(store, () => {
        void fetchBook(id).then(book => {
            store.set(book);
        });
        return () => {
            delete bookStore.cache[id];
        };
    });
    return store;
};

bookStore.cache = {} as Record<string, WritableAtom<Book | null>>;

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

    const build = bookStore.build;

    bookStore.build = (id: string) => {
        const store = atom<Book | null>(book);
        onMount(store, () => () => {
            delete bookStore.cache[id];
        });
        return store;
    };
    bookStore(book.id);

    bookStore.build = build;

    return book;
};
