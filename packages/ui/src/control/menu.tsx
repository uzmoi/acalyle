import { cx, style } from "@acalyle/css";
import { vars } from "../theme/theme";
import { Button } from "./button";

export const Menu: React.FC<React.ComponentProps<"div">> & {
  Item: typeof MenuItem;
} = ({ ...restProps }) => {
  return <div {...restProps} role="menu" />;
};

const MenuItem: React.FC<
  Omit<React.ComponentProps<typeof Button>, "variant">
> = ({ className, ...restProps }) => {
  return (
    <Button
      {...restProps}
      role="menuitem"
      unstyled
      className={cx(
        style({
          display: "block",
          width: "100%",
          padding: "0.25em 1em",
          fontSize: "0.9em",
          fontWeight: "normal",
          textAlign: "start",
          transition: "background-color 200ms, color 200ms",
          "& + &": {
            borderTop: `1px solid ${vars.color.fg.mute}`,
          },
          "&:enabled:is(:hover, :focus)": {
            backgroundColor: "#fff2",
          },
        }),
        className,
      )}
    />
  );
};

// eslint-disable-next-line pure-module/pure-module
Menu.Item = MenuItem;
if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  Menu.Item.displayName = "Menu.Item";
}
