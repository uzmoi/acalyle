import {
    ControlGroup,
    ControlPartOutlineStyle,
    List,
    TextInput,
} from "@acalyle/ui";
import { Tab } from "@headlessui/react";
import { css } from "@linaria/core";
import { useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";
import { TagList } from "~/entities/tag";
import { AddMemoButton } from "~/features/add-memo";
import { MemoImportButton } from "~/features/import-memo";
import { Link, useNavigate } from "~/features/location";
import { UploadResourceButton } from "~/features/resource";
import { BookSettingsPage } from "~/pages/books/book-settings";
import { link } from "~/pages/link";
import { MemoList } from "./MemoList";
import type { BookMemosFragment$key } from "./__generated__/BookMemosFragment.graphql";

export const Book: React.FC<{
    id: string;
    book: BookMemosFragment$key;
    tab?: number;
}> = ({ id, book, tab }) => {
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
        <Tab.Group selectedIndex={tab}>
            <Tab.List as={ControlGroup}>
                <Tab
                    as={Link}
                    to={link("books/:bookId", { bookId: id })}
                    className={ControlPartOutlineStyle}
                >
                    Memos
                </Tab>
                <Tab
                    as={Link}
                    to={link("books/:bookId/resources", { bookId: id })}
                    className={ControlPartOutlineStyle}
                >
                    Resources
                </Tab>
                <Tab
                    as={Link}
                    to={link("books/:bookId/settings", { bookId: id })}
                    className={ControlPartOutlineStyle}
                >
                    Settings
                </Tab>
            </Tab.List>
            <Tab.Panels>
                <Tab.Panel>
                    <List
                        className={css`
                            display: flex;
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
                    </List>
                    <TagList bookId={data.id} tags={data.tags} />
                    <MemoList fragmentRef={data} search={searchString} />
                </Tab.Panel>
                <Tab.Panel>
                    <UploadResourceButton bookId={id} />
                </Tab.Panel>
                <Tab.Panel>
                    <BookSettingsPage id={id} />
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
};
