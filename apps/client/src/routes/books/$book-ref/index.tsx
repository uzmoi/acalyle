import { createFileRoute, useParams } from "@tanstack/react-router";
import type { BookRef } from "~/entities/book";
import { NoteListPage } from "~/pages/note-list";

const RouteComponent: React.FC = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });

  return <NoteListPage bookRef={bookRef as BookRef} />;
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-ref/")({
  component: RouteComponent,
});
