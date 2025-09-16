import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { BookSettingsPage } from "~/pages/book-settings";

const RouteComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.parentRoute.id });

  return <BookSettingsPage book={book} />;
};

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-ref/settings")({
  component: RouteComponent,
});
