import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";

const LayoutComponent: React.FC = () => {
  const { "book-id": _bookId } = useParams({ from: Route.fullPath });

  return (
    <div>
      <Outlet />
    </div>
  );
};

export const Route = /* #__PURE__ */ createFileRoute("/books/$book-id")({
  component: LayoutComponent,
});
