import { createFileRoute, useParams } from "@tanstack/react-router";
import type { BookRef } from "~/entities/book";
import { BookSettingsPage } from "~/pages/book-settings";

const RouteComponent: React.FC = () => {
  const { "book-ref": bookRef } = useParams({ from: Route.fullPath });

  return <BookSettingsPage bookRef={bookRef as BookRef} />;
};

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-ref/settings")({
  component: RouteComponent,
});
