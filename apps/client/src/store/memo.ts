import type { ID } from "~/__generated__/graphql";
import { createQueryStore } from "~/lib/query-store";
import { acalyle } from "../app/main";
import AddMemoTagsMutation from "./add-memo-tags.graphql";
import CreateMemoMutation from "./create-memo.graphql";
import type { Memo } from "./memo-connection";
import MemoTemplateQuery from "./memo-template.graphql";
import MemoQuery from "./memo.graphql";
import RemoveMemoMutation from "./remove-memo.graphql";
import TransferMemoMutation from "./transfer-memo.graphql";
import UpdateMemoContentsMutation from "./update-memo-contents.graphql";

export const memoStore = /* #__PURE__ */ createQueryStore(
    async (memoId: ID): Promise<Memo | null> => {
        const { data } = await acalyle.net.gql(MemoQuery, { memoId });
        return data.memo ?? null;
    },
);

export const memoTemplateStore = /* #__PURE__ */ createQueryStore(
    async (bookId: ID) => {
        const { data } = await acalyle.net.gql(MemoTemplateQuery, { bookId });
        return data.book?.tagProps;
    },
);

export const createMemo = async (bookId: ID, templateName?: string) => {
    const { data } = await acalyle.net.gql(CreateMemoMutation, {
        bookId,
        templateName,
    });
    const memo = data.createMemo;
    memoStore(memo.id).resolve(memo);
    return memo;
};

export const removeMemo = async (memoId: ID) => {
    const { data: _ } = await acalyle.net.gql(RemoveMemoMutation, { memoId });
    memoStore(memoId).resolve(null);
};

export const updateMemoContents = async (
    memoId: ID,
    contents: string,
): Promise<void> => {
    const { data } = await acalyle.net.gql(UpdateMemoContentsMutation, {
        memoId,
        contents,
    });

    if (data.updateMemoContents != null) {
        memoStore(memoId).resolve({
            id: memoId,
            ...data.updateMemoContents,
        });
    }
};

export const addMemoTags = async (memoId: ID, tags: readonly string[]) => {
    const { data } = await acalyle.net.gql(AddMemoTagsMutation, {
        memoId,
        tags,
    });

    for (const memo of data.addMemoTags) {
        if (memo != null) {
            memoStore(memo.id).resolve(memo);
        }
    }
};

export const transferMemo = async (memoId: ID, bookId: ID) => {
    const { data: _ } = await acalyle.net.gql(TransferMemoMutation, {
        memoIds: [memoId],
        bookId,
    });
};
