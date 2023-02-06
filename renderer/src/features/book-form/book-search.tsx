import { css } from "@linaria/core";
import { useCallback, useState, useTransition } from "react";
import { RefetchOptions } from "react-relay";
import {
    Button,
    ControlGroup,
    Form,
    Select,
    TextInput,
} from "~/shared/control";

type BookSortOrder = "Created" | "Title";
type SortOrder = "asc" | "desc";

export const BookSearchBar: React.FC<{
    refetch: (
        vars: {
            query: string;
            orderBy: BookSortOrder;
            order: SortOrder;
        },
        options?: RefetchOptions,
    ) => void;
    className?: string;
}> = ({ refetch, className }) => {
    const [, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [bookSortOrder, setBookSortOrder] =
        useState<BookSortOrder>("Created");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const changeQuery = useCallback(
        (value: string) => {
            setQuery(value);
            // TODO throttle
            startTransition(() => {
                refetch({
                    query: value,
                    orderBy: bookSortOrder,
                    order: sortOrder,
                });
            });
        },
        [bookSortOrder, refetch, sortOrder],
    );
    const changeBookSortOrder = useCallback(
        (value: BookSortOrder) => {
            startTransition(() => {
                refetch({ query, orderBy: value, order: sortOrder });
                setBookSortOrder(value);
            });
        },
        [query, refetch, sortOrder],
    );
    const changeSortOrder = useCallback(
        (value: SortOrder) => {
            startTransition(() => {
                refetch({ query, orderBy: bookSortOrder, order: value });
                setSortOrder(value);
            });
        },
        [bookSortOrder, query, refetch],
    );
    const reload = useCallback(() => {
        startTransition(() => {
            refetch(
                { query, orderBy: bookSortOrder, order: sortOrder },
                { fetchPolicy: "network-only" },
            );
        });
    }, [bookSortOrder, query, refetch, sortOrder]);

    return (
        <Form className={className}>
            <ControlGroup
                className={css`
                    display: flex;
                `}
            >
                <TextInput
                    type="search"
                    className={css`
                        flex: 1 1 0;
                        width: 1em;
                    `}
                    placeholder="Find a book"
                    value={query}
                    onValueChange={changeQuery}
                />
                <Select
                    defaultValue="Created"
                    onValueChange={changeBookSortOrder}
                    aria-label="book sort order"
                >
                    <Select.Option>Created</Select.Option>
                    <Select.Option>Title</Select.Option>
                    <Select.Option value="LastUpdated">
                        Last updated
                    </Select.Option>
                </Select>
                <Select
                    defaultValue="desc"
                    onValueChange={changeSortOrder}
                    aria-label="sort order"
                >
                    <Select.Option value="asc">昇順</Select.Option>
                    <Select.Option value="desc">降順</Select.Option>
                </Select>
                <Button onClick={reload}>reload</Button>
            </ControlGroup>
        </Form>
    );
};
