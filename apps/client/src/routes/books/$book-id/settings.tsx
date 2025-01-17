import { createFileRoute } from "@tanstack/react-router";

const RouteComponent: React.FC = () => {
  return <div></div>;
};

// eslint-disable-next-line pure-module/pure-module
export const Route = createFileRoute("/books/$book-id/settings")({
  component: RouteComponent,
});
