import { Button, ControlGroup, Form, Select, TextInput } from "@acalyle/ui";
import { css } from "@linaria/core";
import { useCallback, useState } from "react";
import type { RefetchOptions } from "react-relay";

type BookSortOrder = "Created" | "Title" | "LastUpdated";
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
    const [vars, setVars] = useState<{
        query: string;
        orderBy: BookSortOrder;
        order: SortOrder;
    }>({ query: "", orderBy: "Created", order: "desc" });

    const changeQuery = useCallback(
        (value: string) => {
            const newVars = { ...vars, query: value };
            // TODO throttle
            refetch(newVars);
            setVars(newVars);
        },
        [vars, refetch],
    );
    const changeBookSortOrder = useCallback(
        (value: BookSortOrder) => {
            const newVars = { ...vars, orderBy: value };
            refetch(newVars);
            setVars(newVars);
        },
        [vars, refetch],
    );
    const changeSortOrder = useCallback(
        (value: SortOrder) => {
            const newVars = { ...vars, order: value };
            refetch(newVars);
            setVars(newVars);
        },
        [vars, refetch],
    );
    const reload = useCallback(() => {
        refetch(vars, { fetchPolicy: "network-only" });
    }, [vars, refetch]);

    return (
        <Form onSubmit={reload} className={className}>
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
                    value={vars.query}
                    onValueChange={changeQuery}
                />
                <Select
                    defaultValue="Created"
                    onValueChange={
                        // FIXME
                        changeBookSortOrder as (value: string) => void
                    }
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
                    // FIXME
                    onValueChange={changeSortOrder as (value: string) => void}
                    aria-label="sort order"
                >
                    <Select.Option value="asc">昇順</Select.Option>
                    <Select.Option value="desc">降順</Select.Option>
                </Select>
                <Button type="submit">reload</Button>
            </ControlGroup>
        </Form>
    );
};
