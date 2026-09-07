import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { BookSettingsPage } from "~/pages/book-settings";

const RouteComponent: React.FC = () => {
  const { book } = useLoaderData({ from: Route.parentRoute.id });

  return <BookSettingsPage book={book} />;
};

export const Route = createFileRoute("/books/$bookRef/settings")({
  component: RouteComponent,
});
