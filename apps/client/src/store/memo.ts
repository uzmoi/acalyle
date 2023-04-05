import { gql } from "graphql-tag";
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
import { createQueryStore } from "~/lib/query-store";
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

export const memoStore = createQueryStore<Memo | null>(
    async (memoId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { graphql } = net.get()!;
        const { data } = await graphql<GqlMemoQuery, GqlMemoQueryVariables>(
            MemoQuery,
            { memoId },
        );
        return data.node?.__typename === "Memo" ? data.node : null;
    },
);

const MemoTemplateQuery = gql`
    query MemoTemplate($bookId: ID!) {
        book(id: $bookId) {
            tagProps(name: "template")
        }
    }
`;

export const memoTemplateStore = createQueryStore<
    readonly string[] | undefined
>(async (bookId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlMemoTemplateQuery,
        GqlMemoTemplateQueryVariables
    >(MemoTemplateQuery, { bookId });
    return data.book?.tagProps;
});

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
    memoStore(memo.id).resolve(memo);
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
    memoStore(memoId).resolve(null);
};

const UpdateMemoContentsMutation = gql`
    mutation UpdateMemoContents($memoId: ID!, $contents: String!) {
        updateMemoContents(memoId: $memoId, contents: $contents) {
            contents
            tags
            createdAt
            updatedAt
        }
    }
`;

export const updateMemoContents = async (
    memoId: string,
    contents: string,
): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { graphql } = net.get()!;
    const { data } = await graphql<
        GqlUpdateMemoContentsMutation,
        GqlUpdateMemoContentsMutationVariables
    >(UpdateMemoContentsMutation, { memoId, contents });

    memoStore(memoId).resolve({
        id: memoId,
        ...data.updateMemoContents,
    });
};

const UpsertMemoTagsMutation = gql`
    mutation UpsertMemoTags($memoId: ID!, $tags: [String!]!) {
        upsertMemoTags(memoIds: [$memoId], tags: $tags) {
            id
            contents
            tags
            createdAt
            updatedAt
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
        memoStore(memo.id).resolve(memo);
    }
};
