import { createFileRoute } from "@tanstack/react-router";
import { NewBookPage } from "~/pages/new-book";

const RouteComponent: React.FC = () => {
  return <NewBookPage />;
};

export const Route = /* #__PURE__ */ createFileRoute("/books/new")({
  component: RouteComponent,
});
