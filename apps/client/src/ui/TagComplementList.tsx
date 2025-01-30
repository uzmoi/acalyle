import { style } from "@acalyle/css";
import { Button, List } from "@acalyle/ui";
import { modulo } from "emnorst";
import { forwardRef, useCallback, useImperativeHandle } from "react";
import { type BookRef, useBookByRef } from "~/entities/book";
import { complementTagSymbol } from "~/lib/complement-tag";

export const TagComplementList: React.FC<{
    ref?: React.LegacyRef<string | undefined>;
    bookRef: BookRef;
    input: string;
    selectedIndex: number;
    onComplement?: (tag: string) => void;
}> = /* #__PURE__ */ forwardRef(
    ({ bookRef, input, selectedIndex, onComplement }, ref) => {
        const book = useBookByRef(bookRef);

        const symbols = complementTagSymbol(book?.tags ?? [], input);

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

        if (book == null) {
            return null;
        }

        return (
            <List className={style({ padding: "0.5em" })}>
                {symbols.map((symbol, i) => (
                    <List.Item
                        key={symbol}
                        data-selected={
                            i === modulo(selectedIndex, symbols.length)
                        }
                        className={style({
                            "&:hover": {
                                backgroundColor: "#0003",
                            },
                            '&[data-selected="true"]': {
                                backgroundColor: "#0003",
                            },
                        })}
                    >
                        <Button
                            unstyled
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
    },
);

// eslint-disable-next-line pure-module/pure-module
TagComplementList.displayName = "TagComplementList";
