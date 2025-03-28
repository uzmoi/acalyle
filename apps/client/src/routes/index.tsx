import { createFileRoute } from "@tanstack/react-router";

const HomeComponent: React.FC = () => {
  return <div className=":uno: p-2">Home</div>;
};

export const Route = /* #__PURE__ */ createFileRoute("/")({
  component: HomeComponent,
});
