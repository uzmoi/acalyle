import { css } from "@linaria/core";
import { useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";
import { TagList } from "~/entities/tag";
import { AddMemoButton } from "~/features/add-memo";
import { MemoImportButton } from "~/features/import-memo";
import { Link, useNavigate } from "~/features/location";
import { link } from "~/pages/link";
import { List } from "~/shared/base";
import { TextInput } from "~/shared/control";
import { MemoList } from "./MemoList";
import type { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

export const Book: React.FC<{
    id: string;
    book: BookMemosFragment$key;
}> = ({ id, book }) => {
    // prettier-ignore
    const data = useFragment<BookMemosFragment$key>(graphql`
        fragment BookMemosFragment on Book {
            id
            title
            tags
            ...MemoListFragment
            ...AddTemplateMemoButtonList
        }
    `, book);

    const [searchString, setSearchString] = useState("");

    const navigate = useNavigate();
    const onMemoAdded = useCallback(
        (memoId: string) => {
            navigate(link("books/:bookId/:memoId", { bookId: id, memoId }));
        },
        [id, navigate],
    );

    return (
        <div>
            <div
                className={css`
                    display: flex;
                    padding-bottom: 1em;
                `}
            >
                <h2
                    className={css`
                        flex-grow: 1;
                    `}
                >
                    {data.title}
                </h2>
                <List
                    className={css`
                        display: flex;
                        flex-shrink: 0;
                        > li ~ li {
                            margin-left: 0.8em;
                        }
                    `}
                >
                    <List.Item>
                        <TextInput
                            value={searchString}
                            onValueChange={setSearchString}
                        />
                    </List.Item>
                    <List.Item>
                        <AddMemoButton
                            bookId={id}
                            onMemoAdded={onMemoAdded}
                            data={data}
                        />
                    </List.Item>
                    <List.Item>
                        <MemoImportButton bookId={id} />
                    </List.Item>
                    <List.Item>
                        <Link
                            to={link("books/:bookId/settings", { bookId: id })}
                        >
                            settings
                        </Link>
                    </List.Item>
                </List>
            </div>
            <TagList bookId={data.id} tags={data.tags} />
            <MemoList fragmentRef={data} search={searchString} />
        </div>
    );
};
