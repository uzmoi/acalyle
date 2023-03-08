import { List } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { TagComplementListQuery } from "./__generated__/TagComplementListQuery.graphql";
import { complementTagSymbol } from "./complement-tag";

export const TagComplementList: React.FC<{
    bookId: string;
    symbol: string;
}> = ({ bookId, symbol }) => {
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

    return (
        <List className={style({ padding: "0.5em" })}>
            {complementTagSymbol(book.book?.tags ?? [], symbol).map(symbol => (
                <List.Item key={symbol}>{symbol}</List.Item>
            ))}
        </List>
    );
};
