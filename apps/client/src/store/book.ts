import { gql } from "graphql-tag";
import { type WritableAtom, atom, onMount } from "nanostores";
import type {
    GqlBookQuery,
    GqlBookQueryVariables,
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
