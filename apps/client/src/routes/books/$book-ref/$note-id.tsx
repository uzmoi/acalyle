import { createFileRoute, useParams } from "@tanstack/react-router";
import type { BookRef } from "~/entities/book";
import type { NoteId } from "~/entities/note";
import { NotePage } from "~/pages/note";

const RouteComponent: React.FC = () => {
  const { "book-ref": bookRef, "note-id": noteId } = useParams({
    from: Route.fullPath,
  });

  return <NotePage bookRef={bookRef as BookRef} noteId={noteId as NoteId} />;
};

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-ref/$note-id")({
  component: RouteComponent,
});
