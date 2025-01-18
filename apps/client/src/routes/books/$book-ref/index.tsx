import { TextInput } from "@acalyle/ui";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useDeferredValue, useState } from "react";
import type { BookRef } from "~/book/store";
import { NoteOverviewWarpList } from "~/note/ui/note-overview-warplist";
import { CreateMemoButton } from "~/ui/CreateMemoButton";

const RouteComponent: React.FC = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <div className=":uno: mb-4 flex gap-4">
        <TextInput
          type="search"
          className=":uno: flex-1"
          onValueChange={setQuery}
        />
        <CreateMemoButton bookHandle={bookRef} />
      </div>
      <NoteOverviewWarpList
        bookRef={bookRef as BookRef}
        query={`-@relate:* ${deferredQuery}`}
      />
    </div>
  );
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-ref/")({
  component: RouteComponent,
});
