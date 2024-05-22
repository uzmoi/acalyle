import { style } from "@acalyle/css";
import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { BiRefresh } from "react-icons/bi";

export const BookSearchBar: React.FC<{
    className?: string;
    query?: string;
    onQueryChange?: (query: string) => void;
    onRefresh?: () => void;
}> = ({ className, query, onQueryChange, onRefresh }) => {
    return (
        <Form onSubmit={onRefresh} className={className}>
            <ControlGroup className={style({ display: "flex" })}>
                <TextInput
                    type="search"
                    className={style({ flex: "1 1" })}
                    placeholder="Find a book"
                    value={query}
                    onValueChange={onQueryChange}
                />
                <Button
                    type="submit"
                    aria-label="Refresh"
                    className={style({
                        padding: "0.25em",
                        fontSize: "1.25em",
                        lineHeight: 1,
                    })}
                >
                    <BiRefresh />
                </Button>
            </ControlGroup>
        </Form>
    );
};
