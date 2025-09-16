import { cx, style } from "@acalyle/css";
import { theme, vars } from "@acalyle/ui";
import type { Preview } from "@storybook/react-vite";
import { defaultThemeClassName } from "../theme";

const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
