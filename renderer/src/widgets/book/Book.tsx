import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment, useMutation } from "react-relay";
import { Button, TextInput } from "~/shared/control";
import { Link } from "~/shared/router/react";
import { MemoList } from "./MemoList";
import { BookMemoCreateMutation } from "./__generated__/BookMemoCreateMutation.graphql";
import { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

export const Book: React.FC<{
    id: string;
    book: BookMemosFragment$key;
}> = ({ id, book }) => {
    const data = useFragment<BookMemosFragment$key>(graphql`
        fragment BookMemosFragment on Book {
            title
            memos(first: $count, after: $cursor) {
                __id
            }
            ...MemoListFragment
        }
    `, book);
    const [commitAddMemo] = useMutation<BookMemoCreateMutation>(graphql`
        mutation BookMemoCreateMutation($bookId: ID!, $connections: [ID!]!) {
            createMemo(bookId: $bookId) {
                node @appendNode(connections: $connections, edgeTypeName: "Memo") {
                    ...MemoOverviewFragment
                }
            }
        }
    `);

    const addMemo = () => {
        commitAddMemo({
            variables: {
                bookId: id,
                connections: [data.memos.__id],
            },
        });
    };

    const [searchString, setSearchString] = useState("");

    return (
        <div>
            <div className={BookHeaderStyle}>
                <h2 className={BookTitleStyle}>{data.title}</h2>
                <ul className={ButtonListStyle}>
                    <li>
                        <TextInput value={searchString} onValueChange={setSearchString} />
                    </li>
                    <li>
                        <Button onClick={addMemo}>add memo</Button>
                    </li>
                    <li>
                        <Link pattern="books/:bookId/settings" params={{ bookId: id }}>
                            settings
                        </Link>
                    </li>
                </ul>
            </div>
            <MemoList fragmentRef={data} search={searchString} />
        </div>
    );
};

const BookHeaderStyle = css`
    display: flex;
    padding: 1em;
    padding-right: 2em;
    padding-left: 2em;
`;

const BookTitleStyle = css`
    flex-grow: 1;
`;

const ButtonListStyle = css`
    display: flex;
    flex-shrink: 0;
    > li ~ li {
        margin-left: 0.8em;
    }
`;
