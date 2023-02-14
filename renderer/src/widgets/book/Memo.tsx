import { css } from "@linaria/core";
import { graphql, useFragment } from "react-relay";
import { MemoInfo } from "~/entities/memo";
import { TagList } from "~/entities/tag";
import { vars } from "~/entities/theme";
import { Markdown } from "~/features/markdown";
import { Button } from "~/shared/control";
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
        <article
            className={css`
                padding: 1em;
                background-color: ${vars.color.bg3};
            `}
        >
            <Markdown contents={contents} />
            <footer
                className={css`
                    display: flex;
                    font-size: 0.8em;
                `}
            >
                <div
                    className={css`
                        flex: 1;
                    `}
                >
                    <MemoInfo createdAt={createdAt} updatedAt={updatedAt} />
                    <TagList tags={tags} bookId={bookId} />
                </div>
                <div>
                    <Button
                        onClick={() => {
                            // TODO
                        }}
                    >
                        Edit
                    </Button>
                </div>
            </footer>
        </article>
    );
};
