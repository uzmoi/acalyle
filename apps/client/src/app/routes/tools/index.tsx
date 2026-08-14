import { List } from "@acalyle/ui";
import { Link, createFileRoute } from "@tanstack/react-router";

const RouteComponent: React.FC = () => {
  return (
    <div className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <h1 className=":uno: inline text-xl">Acalyle Tools</h1>
      <List variant="default" className=":uno: my-4">
        <List.Item>
          <Link
            to="/tools/theme-builder"
            className=":uno: text-lg text-inherit"
          >
            Theme Builder
          </Link>
        </List.Item>
      </List>
    </div>
  );
};

export const Route = createFileRoute("/tools/")({
  component: RouteComponent,
});
