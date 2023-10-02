import { gql } from "graphql-tag";
import type {
    GqlAddMemoTagsMutation,
    GqlAddMemoTagsMutationVariables,
    GqlCreateMemoMutation,
    GqlCreateMemoMutationVariables,
    GqlMemoQuery,
    GqlMemoQueryVariables,
    GqlMemoTemplateQuery,
    GqlMemoTemplateQueryVariables,
    GqlRemoveMemoMutation,
    GqlRemoveMemoMutationVariables,
    GqlTransferMemoMutation,
    GqlTransferMemoMutationVariables,
    GqlUpdateMemoContentsMutation,
    GqlUpdateMemoContentsMutationVariables,
    Scalars,
} from "~/__generated__/graphql";
import { createQueryStore } from "~/lib/query-store";
import { acalyle } from "../app/main";
import type { Memo } from "./memo-connection";

const MemoQuery = /* #__PURE__ */ gql`
    query Memo($memoId: ID!) {
        memo(id: $memoId) {
            id
            contents
            tags
            createdAt
            updatedAt
        }
    }
`;

export const memoStore = /* #__PURE__ */ createQueryStore(
    async (memoId: Scalars["ID"]): Promise<Memo | null> => {
        const { data } = await acalyle.net.gql<
            GqlMemoQuery,
            GqlMemoQueryVariables
        >(MemoQuery, { memoId });
        return data.memo ?? null;
    },
);

const MemoTemplateQuery = /* #__PURE__ */ gql`
    query MemoTemplate($bookId: ID!) {
        book(id: $bookId) {
            tagProps(symbol: "template")
        }
    }
`;

export const memoTemplateStore = /* #__PURE__ */ createQueryStore(
    async (bookId: Scalars["ID"]) => {
        const { data } = await acalyle.net.gql<
            GqlMemoTemplateQuery,
            GqlMemoTemplateQueryVariables
        >(MemoTemplateQuery, { bookId });
        return data.book?.tagProps;
    },
);

const CreateMemoMutation = /* #__PURE__ */ gql`
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

export const createMemo = async (
    bookId: Scalars["ID"],
    templateName?: string,
) => {
    const { data } = await acalyle.net.gql<
        GqlCreateMemoMutation,
        GqlCreateMemoMutationVariables
    >(CreateMemoMutation, { bookId, templateName });
    const memo = data.createMemo;
    memoStore(memo.id).resolve(memo);
    return memo;
};

const RemoveMemoMutation = /* #__PURE__ */ gql`
    mutation RemoveMemo($memoId: ID!) {
        removeMemo(ids: [$memoId])
    }
`;

export const removeMemo = async (memoId: Scalars["ID"]) => {
    const { data: _ } = await acalyle.net.gql<
        GqlRemoveMemoMutation,
        GqlRemoveMemoMutationVariables
    >(RemoveMemoMutation, { memoId });
    memoStore(memoId).resolve(null);
};

const UpdateMemoContentsMutation = /* #__PURE__ */ gql`
    mutation UpdateMemoContents($memoId: ID!, $contents: String!) {
        updateMemoContents(id: $memoId, contents: $contents) {
            contents
            tags
            createdAt
            updatedAt
        }
    }
`;

export const updateMemoContents = async (
    memoId: Scalars["ID"],
    contents: string,
): Promise<void> => {
    const { data } = await acalyle.net.gql<
        GqlUpdateMemoContentsMutation,
        GqlUpdateMemoContentsMutationVariables
    >(UpdateMemoContentsMutation, { memoId, contents });

    if (data.updateMemoContents != null) {
        memoStore(memoId).resolve({
            id: memoId,
            ...data.updateMemoContents,
        });
    }
};

const AddMemoTagsMutation = /* #__PURE__ */ gql`
    mutation AddMemoTags($memoId: ID!, $tags: [String!]!) {
        addMemoTags(ids: [$memoId], tags: $tags) {
            id
            contents
            tags
            createdAt
            updatedAt
        }
    }
`;

export const addMemoTags = async (
    memoId: Scalars["ID"],
    tags: readonly string[],
) => {
    const { data } = await acalyle.net.gql<
        GqlAddMemoTagsMutation,
        GqlAddMemoTagsMutationVariables
    >(AddMemoTagsMutation, { memoId, tags });

    for (const memo of data.addMemoTags) {
        if (memo != null) {
            memoStore(memo.id).resolve(memo);
        }
    }
};

const TransferMemoMutation = /* #__PURE__ */ gql`
    mutation TransferMemo($memoIds: [ID!]!, $bookId: ID!) {
        transferMemo(memoIds: $memoIds, bookId: $bookId)
    }
`;

export const transferMemo = async (
    memoId: Scalars["ID"],
    bookId: Scalars["ID"],
) => {
    const { data: _ } = await acalyle.net.gql<
        GqlTransferMemoMutation,
        GqlTransferMemoMutationVariables
    >(TransferMemoMutation, { memoIds: [memoId], bookId });
};
