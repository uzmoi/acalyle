import {
  createFileRoute,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import type { NoteId } from "~/entities/note";
import { NotePage } from "~/pages/note";

const RouteComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.parentRoute.id });
  const { noteId } = useParams({ from: Route.fullPath });

  return <NotePage book={book} noteId={noteId as NoteId} />;
};

export const Route = createFileRoute("/books/$bookRef/$noteId")({
  component: RouteComponent,
});
