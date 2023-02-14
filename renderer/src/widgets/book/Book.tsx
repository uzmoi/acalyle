import { css } from "@linaria/core";
import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { AddMemoButton } from "~/features/add-memo";
import { Link } from "~/features/location";
import { link } from "~/pages/link";
import { List } from "~/shared/base";
import { TextInput } from "~/shared/control";
import { MemoList } from "./MemoList";
import { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

export const Book: React.FC<{
    id: string;
    book: BookMemosFragment$key;
}> = ({ id, book }) => {
    // prettier-ignore
    const data = useFragment<BookMemosFragment$key>(graphql`
        fragment BookMemosFragment on Book {
            title
            ...MemoListFragment
        }
    `, book);

    const [searchString, setSearchString] = useState("");

    return (
        <div>
            <div className={BookHeaderStyle}>
                <h2 className={BookTitleStyle}>{data.title}</h2>
                <List className={ButtonListStyle}>
                    <List.Item>
                        <TextInput
                            value={searchString}
                            onValueChange={setSearchString}
                        />
                    </List.Item>
                    <List.Item>
                        <AddMemoButton bookId={id} />
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
