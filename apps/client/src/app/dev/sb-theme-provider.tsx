import type { Preview } from "@storybook/react-vite";
import { cx, style } from "@acalyle/css";
import { vars } from "@acalyle/ui";
import { theme } from "~/theme";
import { defaultTheme } from "~/theme/default";

const Provider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      className={cx(
        defaultTheme,
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
  <Provider>{story()}</Provider>
);
