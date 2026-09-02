import { type Theme, createTheme } from "@acalyle/ui";
import type { Preview } from "@storybook/react-vite";
import {
  FALLBACK_THEME,
  createThemeDefinitionStyle,
  tth,
} from "#/entities/theme";
import { cx, style } from "asarina";
import { defaultThemeClassName } from "../theme";

const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
          ...tth.style("ui-text"),
        }),
      )}
      style={createThemeDefinitionStyle(FALLBACK_THEME)}
    >
      {children}
    </div>
  );
};

type SbDecorator = Exclude<
  Preview["decorators"],
  readonly unknown[] | undefined
>;

export const withThemeProvider: SbDecorator = story => (
  <ThemeProvider>{story()}</ThemeProvider>
);
