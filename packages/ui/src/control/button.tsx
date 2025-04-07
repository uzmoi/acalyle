import { cx, style } from "@acalyle/css";
import { vars } from "../theme";
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
          "&:disabled": {
            color: vars.color.fg.mute,
            cursor: "not-allowed",
          },
        }),
        className,
      )}
      {...restProps}
    />
  );
};
