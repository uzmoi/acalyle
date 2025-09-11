import {
  createFileRoute,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import type { NoteId } from "~/entities/note";
import { NotePage } from "~/pages/note";

const RouteComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.parentRoute.id });
  const { "note-id": noteId } = useParams({ from: Route.fullPath });

  return <NotePage book={book} noteId={noteId as NoteId} />;
};

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-ref/$note-id")({
  component: RouteComponent,
});
