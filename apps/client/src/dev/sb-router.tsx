import type { Preview } from "@storybook/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// https://github.com/TanStack/router/discussions/952#discussioncomment-8714622
const router = /* #__PURE__ */ (() => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
  });
  const memoryHistory = createMemoryHistory({ initialEntries: ["/"] });
  const routeTree = rootRoute.addChildren([indexRoute]);
  return createRouter({ routeTree, history: memoryHistory });
})();

type SbDecorator = Exclude<
  Preview["decorators"],
  readonly unknown[] | undefined
>;

export const withTanstackRouter: SbDecorator = story => (
  <RouterProvider router={router} defaultComponent={story} />
);
