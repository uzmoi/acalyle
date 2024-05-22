import { style } from "@acalyle/css";
import { TextInput } from "@acalyle/ui";
import { useDeferredValue, useState } from "react";
import type { BookRef } from "~/book/store";
import { NoteOverviewWarpList } from "~/note/ui/note-overview-warplist";
import { CreateMemoButton } from "~/ui/CreateMemoButton";

export const MemoListPage: React.FC<{
    bookHandle: string;
}> = ({ bookHandle }) => {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);

    return (
        <div>
            <div className={style({ display: "flex", gap: "1em" })}>
                <TextInput
                    type="search"
                    className={style({ flex: "1 1" })}
                    onValueChange={setQuery}
                />
                <CreateMemoButton bookHandle={bookHandle} />
                {/* <MemoImportButton /> */}
            </div>
            <NoteOverviewWarpList
                bookRef={bookHandle as BookRef}
                query={`-@relate:* ${deferredQuery}`}
            />
        </div>
    );
};
