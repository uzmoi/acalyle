import { Button, List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { modulo } from "emnorst";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { TagComplementListQuery } from "./__generated__/TagComplementListQuery.graphql";
import { complementTagSymbol } from "./complement-tag";

export const TagComplementList: React.FC<{
    ref?: React.Ref<string | undefined>;
    bookId: string;
    input: string;
    selectedIndex: number;
    onComplement?: (tag: string) => void;
}> = forwardRef(({ bookId, input, selectedIndex, onComplement }, ref) => {
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

    const onClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const symbol = e.currentTarget.dataset.symbol;
            if (symbol != null) {
                onComplement?.(symbol);
            }
        },
        [onComplement],
    );

    return (
        <List className={style({ padding: "0.5em" })}>
            {symbols.map((symbol, i) => (
                <List.Item
                    key={symbol}
                    data-selected={i === modulo(selectedIndex, symbols.length)}
                    className={style({
                        ":hover": {
                            backgroundColor: "#0003",
                        },
                        selectors: {
                            '&[data-selected="true"]': {
                                backgroundColor: "#0003",
                            },
                        },
                    })}
                >
                    <Button
                        variant="unstyled"
                        className={style({
                            width: "100%",
                            textAlign: "start",
                            fontWeight: "normal",
                        })}
                        data-symbol={symbol}
                        onClick={onClick}
                    >
                        {symbol}
                    </Button>
                </List.Item>
            ))}
        </List>
    );
});

if (import.meta.env.DEV) {
    TagComplementList.displayName = "TagComplementList";
}
