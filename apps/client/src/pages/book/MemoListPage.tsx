import { TextInput } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useMemo, useState } from "react";
import { debounce } from "~/lib/debounce";
import { CreateMemoButton } from "~/ui/CreateMemoButton";
import { MemoList } from "~/ui/MemoList";

export const MemoListPage: React.FC<{
    bookHandle: string;
}> = ({ bookHandle }) => {
    const [query, setQuery] = useState("");

    const debouncedSetQuery = useMemo(() => debounce(setQuery), []);

    return (
        <div>
            <div className={style({ display: "flex", gap: "1em" })}>
                <TextInput
                    type="search"
                    className={style({ flex: "1 1" })}
                    onValueChange={debouncedSetQuery}
                />
                <CreateMemoButton bookHandle={bookHandle} />
                {/* <MemoImportButton /> */}
            </div>
            <MemoList bookHandle={bookHandle} query={`-@relate:* ${query}`} />
        </div>
    );
};
