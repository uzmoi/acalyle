import type { Preview } from "@storybook/react-vite";
import { themeVar } from "#/entities/theme";
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
          color: themeVar("ui-text"),
        }),
      )}
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
