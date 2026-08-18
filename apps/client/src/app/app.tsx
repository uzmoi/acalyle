import { type Theme, createTheme } from "@acalyle/ui";
import { RouterProvider } from "@tanstack/react-router";
import { cx, style } from "asarina";
import { themeVar } from "#/entities/theme";
import { QuickModalContainer } from "#/features/modal";
import { router } from "./router";
import { defaultThemeClassName } from "./theme";

export const App: React.FC = () => {
  return (
    <div
      className={cx(
        defaultThemeClassName,
        ":uno: font-sans",
        style({
          minHeight: "100%",
          ...createTheme({
            control: {
              text: themeVar("ui-text"),
              bg: themeVar("ui-control-bg"),
              outline: themeVar("ui-border"),
            },
          } as Theme),
          color: themeVar("ui-text"),
          backgroundColor: themeVar("app-bg"),
        }),
      )}
    >
      <RouterProvider router={router} />
      <QuickModalContainer />
    </div>
  );
};
