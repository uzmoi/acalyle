import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { NoteListPage } from "~/pages/note-list";

const RouteComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.parentRoute.id });

  return <NoteListPage book={book} />;
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-ref/")({
  component: RouteComponent,
});
