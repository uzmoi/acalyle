import { css } from "@linaria/core";
import { graphql, useFragment } from "react-relay";
import { MemoInfo } from "~/entities/memo";
import { TagList } from "~/entities/tag";
import { Markdown } from "~/features/markdown";
import { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const Memo: React.FC<{
    bookId: string;
    memo: MemoFragment$key;
}> = ({ bookId, memo }) => {
    const { contents, tags, createdAt, updatedAt } =
        useFragment<MemoFragment$key>(
            graphql`
                fragment MemoFragment on Memo {
                    contents
                    tags
                    createdAt
                    updatedAt
                }
            `,
            memo,
        );

    return (
        <div
            className={css`
                padding: 1em;
            `}
        >
            <Markdown contents={contents} />
            <div
                className={css`
                    font-size: 0.8em;
                `}
            >
                <MemoInfo createdAt={createdAt} updatedAt={updatedAt} />
                <TagList tags={tags} bookId={bookId} />
            </div>
        </div>
    );
};
