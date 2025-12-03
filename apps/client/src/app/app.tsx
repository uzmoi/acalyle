import { cx, style } from "@acalyle/css";
import { theme, vars } from "@acalyle/ui";
import { RouterProvider } from "@tanstack/react-router";
import { QuickModalContainer } from "~/features/modal";
import { router } from "./router";
import { defaultThemeClassName } from "./theme";

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
