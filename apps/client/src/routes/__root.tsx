import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const Devtools =
  import.meta.env.DEV ?
    lazy(async () => {
      const tanstackRouter = await import("@tanstack/router-devtools");
      const devtools = (
        <>
          <tanstackRouter.TanStackRouterDevtools />
        </>
      );
      return { default: () => devtools };
    })
  : () => null;

const Root: React.FC = () => {
  return (
    <div>
      <Outlet />
      <Suspense>
        <Devtools />
      </Suspense>
    </div>
  );
};

export const Route = createRootRoute({
  component: Root,
});
