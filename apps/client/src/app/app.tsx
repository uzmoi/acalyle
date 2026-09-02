import { type Theme, createTheme } from "@acalyle/ui";
import { RouterProvider } from "@tanstack/react-router";
import { cx, style } from "asarina";
import { tth, useThemeDefinitionStyle } from "#/entities/theme";
import { QuickModalContainer } from "#/features/modal";
import { router } from "./router";
import { defaultThemeClassName } from "./theme";

export const App: React.FC = () => {
  const themeStyle = useThemeDefinitionStyle();

  return (
    <div
      className={cx(
        defaultThemeClassName,
        ":uno: font-sans",
        style({
          minHeight: "100%",
          ...createTheme({
            control: {
              text: tth("$ui-text"),
              bg: tth("$ui-control-bg"),
              outline: tth("$ui-border"),
            },
          } as Theme),
          ...tth.style("app-bg", "ui-text"),
        }),
      )}
      style={themeStyle}
    >
      <RouterProvider router={router} />
      <QuickModalContainer />
    </div>
  );
};
