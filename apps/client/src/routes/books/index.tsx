import { createFileRoute } from "@tanstack/react-router";
import { BookListPage } from "~/pages/BookListPage";

const RouteComponent: React.FC = () => {
  return <BookListPage />;
};

export const Route = /* #__PURE__ */ createFileRoute("/books/")({
  component: RouteComponent,
});
