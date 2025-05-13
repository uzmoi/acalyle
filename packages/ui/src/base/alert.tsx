import { cx, style } from "@acalyle/css";
import { vars } from "../theme";

export interface AlertProps extends Omit<React.ComponentProps<"div">, "role"> {
  type: "error" | "warning" | "success";
}

export const Alert: React.FC<AlertProps> = ({
  type,
  className,
  ...restProps
}) => {
  return (
    <div
      {...restProps}
      role="alert"
      data-alert={type}
      className={cx(
        style({
          padding: "0.75em 1.25em",
          border: "1px solid var(--alert-color)",
          borderRadius: vars.radius.block,
          '&[data-alert="error"]': {
            "--alert-color": vars.color.danger,
          },
          '&[data-alert="warning"]': {
            "--alert-color": vars.color.warning,
          },
          '&[data-alert="success"]': {
            "--alert-color": vars.color.success,
          },
        }),
        className,
      )}
    />
  );
};
