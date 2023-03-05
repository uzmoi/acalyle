import { vars } from "@acalyle/ui";
import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { MemoInfo } from "~/entities/memo";
import { TagList } from "~/entities/tag";
import { Markdown } from "~/features/markdown";
import { MemoContentsEditor } from "~/features/memo-editor";
import { Button } from "~/shared/control";
import type { MemoFragment$key } from "./__generated__/MemoFragment.graphql";

export const Memo: React.FC<{
    bookId: string;
    memo: MemoFragment$key;
}> = ({ bookId, memo }) => {
    const { id, contents, tags, createdAt, updatedAt } =
        useFragment<MemoFragment$key>(
            graphql`
                fragment MemoFragment on Memo {
                    id
                    contents
                    tags
                    createdAt
                    updatedAt
                }
            `,
            memo,
        );

    const [isInEdit, setIsInEdit] = useState(false);

    return (
        <article
            className={css`
                padding: 1em;
                background-color: ${vars.color.bg3};
            `}
        >
            <header
                className={css`
                    display: flex;
                    margin-bottom: 0.75em;
                `}
            >
                <div
                    className={css`
                        flex: 1;
                        font-size: 0.8em;
                    `}
                >
                    <MemoInfo createdAt={createdAt} updatedAt={updatedAt} />
                    <TagList tags={tags} bookId={bookId} />
                </div>
                <div>
                    <Button
                        disabled={isInEdit}
                        onClick={() => {
                            setIsInEdit(true);
                        }}
                    >
                        Edit
                    </Button>
                </div>
            </header>
            {isInEdit || <Markdown contents={contents} />}
            {isInEdit && (
                <MemoContentsEditor
                    memoId={id}
                    defaultContents={contents}
                    onEditEnd={() => {
                        setIsInEdit(false);
                    }}
                />
            )}
        </article>
    );
};
