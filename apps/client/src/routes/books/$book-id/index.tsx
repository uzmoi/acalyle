import { createFileRoute, useParams } from "@tanstack/react-router";

const RouteComponent: React.FC = () => {
  const { "book-id": _bookId } = useParams({ from: "/books/$book-id/" });

  return <div></div>;
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-id/")({
  component: RouteComponent,
});
