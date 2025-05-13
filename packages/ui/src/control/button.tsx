import { cx, style } from "@acalyle/css";
import { theme } from "../theme";
import { base, reset } from "./base";

export interface ButtonProps extends React.ComponentProps<"button"> {
  unstyled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  unstyled,
  className,
  ...restProps
}) => {
  return (
    <button
      type="button"
      className={cx(
        reset,
        !unstyled && base,
        style({
          fontWeight: "bold",
          cursor: "pointer",
          "&:hover": {
            color: theme("control:hover-text"),
            background: theme("control:hover-bg"),
            borderColor: theme("control:hover-outline"),
          },
          "&:active": {
            color: theme("control:active-text"),
            background: theme("control:active-bg"),
            borderColor: theme("control:active-outline"),
          },
          "&:disabled": {
            color: theme("control:disabled-text"),
            background: theme("control:disabled-bg"),
            borderColor: theme("control:disabled-outline"),
            cursor: "not-allowed",
          },
        }),
        className,
      )}
      {...restProps}
    />
  );
};
