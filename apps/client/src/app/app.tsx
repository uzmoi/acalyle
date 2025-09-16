import { cx, style } from "@acalyle/css";
import { theme, vars } from "@acalyle/ui";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QuickModalContainer } from "~/features/modal";
import { routeTree } from "./routeTree.gen";
import { defaultThemeClassName } from "./theme";

const router = /* #__PURE__ */ createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App: React.FC = () => {
  return (
    <div
      className={cx(
        defaultThemeClassName,
        style({
          minHeight: "100%",
          fontFamily: vars.font.sans,
          color: theme("app-text"),
          backgroundColor: theme("app-bg"),
        }),
      )}
    >
      <RouterProvider router={router} />
      <QuickModalContainer />
    </div>
  );
};
