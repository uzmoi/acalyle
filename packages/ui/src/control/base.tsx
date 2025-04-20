/* eslint-disable pure-module/pure-module */
import { cx, style } from "@acalyle/css";
import { theme } from "../theme";

export const ControlGroup: React.FC<React.ComponentProps<"div">> = props => {
  return <div {...props} className={cx(group, props.className)} />;
};

const group = style({ display: "inline-block" });

export const reset = style({
  padding: 0,
  font: "inherit",
  color: "inherit",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: 0,
  outline: "none",
  appearance: "none",
});

export const base = style({
  padding: "0.2em 0.8em",

  selectors: {
    [`.${group} > & + &`]: { marginLeft: "2px" },
    [`.${group} > &`]: { borderRadius: 0 },
    [`.${group} > &:first-child`]: {
      borderRadius: `${theme("control-radius")} 0 0 ${theme("control-radius")}`,
    },
    [`.${group} > &:last-child`]: {
      borderRadius: `0 ${theme("control-radius")} ${theme("control-radius")} 0`,
    },
    [`.${group} > &:only-child, &`]: {
      borderRadius: theme("control-radius"),
    },
  },

  color: theme("control-text"),
  background: theme("control-bg"),
  border: `1px solid ${theme("control-outline")}`,
  transition: "0.25s",
  '&:user-invalid, &:user-valid[aria-invalid="true"]': {
    color: theme("control:invalid-text"),
    background: theme("control:invalid-bg"),
    borderColor: theme("control:invalid-outline"),
  },
  "&:focus-visible": {
    color: theme("control:focus-text"),
    background: theme("control:focus-bg"),
    borderColor: theme("control:focus-outline"),
  },
});
