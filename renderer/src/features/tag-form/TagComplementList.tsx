import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { modulo } from "emnorst";
import { forwardRef, useImperativeHandle } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { TagComplementListQuery } from "./__generated__/TagComplementListQuery.graphql";
import { complementTagSymbol } from "./complement-tag";

export const TagComplementList: React.FC<{
    ref?: React.Ref<string | undefined>;
    bookId: string;
    input: string;
    selectedIndex: number;
}> = forwardRef(({ bookId, input, selectedIndex }, ref) => {
    const book = useLazyLoadQuery<TagComplementListQuery>(
        graphql`
            query TagComplementListQuery($bookId: ID!) {
                book(id: $bookId) {
                    tags
                }
            }
        `,
        { bookId },
    );

    const symbols = complementTagSymbol(book.book?.tags ?? [], input);

    useImperativeHandle(
        ref,
        () => symbols[modulo(selectedIndex, symbols.length)],
    );

    return (
        <List className={style({ padding: "0.5em" })}>
            {symbols.map((symbol, i) => (
                <List.Item
                    key={symbol}
                    data-selected={i === modulo(selectedIndex, symbols.length)}
                    className={style({
                        selectors: {
                            '&[data-selected="true"]': {
                                backgroundColor: "#0003",
                            },
                        },
                    })}
                >
                    {symbol}
                </List.Item>
            ))}
        </List>
    );
});

if (import.meta.env.DEV) {
    TagComplementList.displayName = "TagComplementList";
}
