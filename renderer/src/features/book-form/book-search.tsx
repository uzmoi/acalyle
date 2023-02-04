import { css, cx } from "@linaria/core";
import { useCallback, useState, useTransition } from "react";
import { ControlGroup, Select, TextInput } from "~/shared/control";

type BookSortOrder = "Created" | "Title";
type SortOrder = "asc" | "desc";

export const BookSearchBar: React.FC<{
    refetch: (vars: { orderBy: BookSortOrder; order: SortOrder }) => void;
    className?: string;
}> = ({ refetch, className }) => {
    const [, startTransition] = useTransition();
    const [bookSortOrder, setBookSortOrder] =
        useState<BookSortOrder>("Created");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const changeBookSortOrder = useCallback(
        (value: BookSortOrder) => {
            startTransition(() => {
                refetch({ orderBy: value, order: sortOrder });
                setBookSortOrder(value);
            });
        },
        [refetch, sortOrder],
    );
    const changeSortOrder = useCallback(
        (value: SortOrder) => {
            startTransition(() => {
                refetch({ orderBy: bookSortOrder, order: value });
                setSortOrder(value);
            });
        },
        [bookSortOrder, refetch],
    );

    return (
        <ControlGroup
            className={cx(
                css`
                    display: flex;
                `,
                className,
            )}
        >
            <Select
                defaultValue="Created"
                onValueChange={changeBookSortOrder}
                aria-label="book sort order"
            >
                <Select.Option>Created</Select.Option>
                <Select.Option>Title</Select.Option>
                <Select.Option value="LastUpdated">Last updated</Select.Option>
            </Select>
            <Select
                defaultValue="desc"
                onValueChange={changeSortOrder}
                aria-label="sort order"
            >
                <Select.Option value="asc">昇順</Select.Option>
                <Select.Option value="desc">降順</Select.Option>
            </Select>
        </ControlGroup>
    );
};
