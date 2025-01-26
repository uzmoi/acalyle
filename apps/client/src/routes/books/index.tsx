import { createFileRoute } from "@tanstack/react-router";
import { BookListPage } from "~/pages/book-list";

const RouteComponent: React.FC = () => {
  return <BookListPage />;
};

export const Route = /* #__PURE__ */ createFileRoute("/books/")({
  component: RouteComponent,
});
