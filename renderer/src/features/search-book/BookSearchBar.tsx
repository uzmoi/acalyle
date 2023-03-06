import { Button, ControlGroup, Form, Select, TextInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback, useState } from "react";
import { BiRefresh, BiSortAZ, BiSortZA } from "react-icons/bi";
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
    const toggleSortOrder = useCallback(() => {
        const order =
            vars.order === "asc" ? ("desc" as const) : ("asc" as const);
        const newVars = { ...vars, order };
        refetch(newVars);
        setVars(newVars);
    }, [vars, refetch]);
    const reload = useCallback(() => {
        refetch(vars, { fetchPolicy: "network-only" });
    }, [vars, refetch]);

    return (
        <Form onSubmit={reload} className={className}>
            <ControlGroup className={style({ display: "flex" })}>
                <TextInput
                    type="search"
                    className={style({ flex: "1 1 0", width: "1em" })}
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
                <Button
                    variant="icon"
                    onClick={toggleSortOrder}
                    aria-label="sort order"
                >
                    {vars.order === "asc" && <BiSortAZ />}
                    {vars.order === "desc" && <BiSortZA />}
                </Button>
                <Button type="submit" variant="icon">
                    <BiRefresh />
                </Button>
            </ControlGroup>
        </Form>
    );
};
