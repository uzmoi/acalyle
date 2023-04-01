import { gql } from "graphql-tag";
import { type WritableAtom, atom, onMount } from "nanostores";
import type {
    GqlCreateMemoMutation,
    GqlCreateMemoMutationVariables,
    GqlMemoQuery,
    GqlMemoQueryVariables,
    GqlMemoTemplateQuery,
    GqlMemoTemplateQueryVariables,
    GqlRemoveMemoMutation,
    GqlRemoveMemoMutationVariables,
    GqlUpdateMemoContentsMutation,
    GqlUpdateMemoContentsMutationVariables,
    GqlUpsertMemoTagsMutation,
    GqlUpsertMemoTagsMutationVariables,
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
        if (store.get() == null) {
            void fetchMemo(id).then(memo => {
                store.set(memo);
            });
        }
        return () => {
            delete memoStore.cache[id];
        };
    });
    return store;
};

memoStore.cache = {} as Record<string, WritableAtom<Memo | null>>;

const MemoTemplateQuery = gql`
    query MemoTemplate($bookId: ID!) {
        book(id: $bookId) {
            tagProps(name: "template")
        }
    }
`;

const fetchMemoTemplate = async (bookId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlMemoTemplateQuery,
        GqlMemoTemplateQueryVariables
    >(MemoTemplateQuery, { bookId });
    return data.book?.tagProps;
};

export const memoTemplateStore = (id: string) => {
    if (!memoTemplateStore.cache[id]) {
        memoTemplateStore.cache[id] = memoTemplateStore.build(id);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return memoTemplateStore.cache[id]!;
};

memoTemplateStore.build = (id: string) => {
    const store = atom<readonly string[] | undefined>();
    onMount(store, () => {
        void fetchMemoTemplate(id).then(templateNames => {
            store.set(templateNames);
        });
        return () => {
            delete memoTemplateStore.cache[id];
        };
    });
    return store;
};

memoTemplateStore.cache = {} as Record<
    string,
    WritableAtom<readonly string[] | undefined>
>;

const CreateMemoMutation = gql`
    mutation CreateMemo($bookId: ID!, $templateName: String) {
        createMemo(bookId: $bookId, template: $templateName) {
            id
            contents
            tags
            createdAt
            updatedAt
        }
    }
`;

export const createMemo = async (bookId: string, templateName?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlCreateMemoMutation,
        GqlCreateMemoMutationVariables
    >(CreateMemoMutation, { bookId, templateName });
    const memo = data.createMemo;
    memoStore(memo.id).set(memo);
    return memo;
};

const RemoveMemoMutation = gql`
    mutation RemoveMemo($memoId: ID!) {
        removeMemo(ids: [$memoId])
    }
`;

export const removeMemo = async (memoId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data: _ } = await graphql<
        GqlRemoveMemoMutation,
        GqlRemoveMemoMutationVariables
    >(RemoveMemoMutation, { memoId });
    memoStore(memoId).set(null);
};

const UpdateMemoContentsMutation = gql`
    mutation UpdateMemoContents($memoId: ID!, $contents: String!) {
        updateMemoContents(memoId: $memoId, contents: $contents) {
            id
            contents
            updatedAt
        }
    }
`;

export const updateMemoContents = async (memoId: string, contents: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlUpdateMemoContentsMutation,
        GqlUpdateMemoContentsMutationVariables
    >(UpdateMemoContentsMutation, { memoId, contents });

    const store = memoStore(data.updateMemoContents.id);
    const memo = store.get();
    if (memo) {
        store.set({
            ...memo,
            contents: data.updateMemoContents.contents,
            updatedAt: data.updateMemoContents.updatedAt,
        });
    }

    return memo;
};

const UpsertMemoTagsMutation = gql`
    mutation UpsertMemoTags($memoId: ID!, $tags: [String!]!) {
        upsertMemoTags(memoIds: [$memoId], tags: $tags) {
            id
            tags
        }
    }
`;

export const upsertMemoTags = async (
    memoId: string,
    tags: readonly string[],
) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlUpsertMemoTagsMutation,
        GqlUpsertMemoTagsMutationVariables
    >(UpsertMemoTagsMutation, { memoId, tags });

    for (const memo of data.upsertMemoTags) {
        const store = memoStore(memo.id);
        const currentMemo = store.get();
        if (currentMemo != null) {
            store.set({ ...currentMemo, tags: memo.tags });
        }
    }
};
