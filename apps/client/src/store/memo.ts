import { gql } from "graphql-tag";
import { type WritableAtom, atom, onMount } from "nanostores";
import type {
    GqlMemoQuery,
    GqlMemoQueryVariables,
} from "~/__generated__/graphql";
import type { Memo } from "./memo-connection";
import { net } from "./net";

const MemoQuery = gql`
    query Memo($memoId: ID!) {
        node(id: $memoId) {
            __typename
            ... on Memo {
                id
                contents
                tags
                createdAt
                updatedAt
            }
        }
    }
`;

const fetchMemo = async (memoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<GqlMemoQuery, GqlMemoQueryVariables>(
        MemoQuery,
        { memoId },
    );
    return data.node?.__typename === "Memo" ? data.node : null;
};

export const memoStore = (id: string) => {
    if (!memoStore.cache[id]) {
        memoStore.cache[id] = memoStore.build(id);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return memoStore.cache[id]!;
};

memoStore.build = (id: string) => {
    const store = atom<Memo | null>(null);
    onMount(store, () => {
        void fetchMemo(id).then(memo => {
            store.set(memo);
        });
        return () => {
            delete memoStore.cache[id];
        };
    });
    return store;
};

memoStore.cache = {} as Record<string, WritableAtom<Memo | null>>;
