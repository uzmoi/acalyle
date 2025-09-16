/* eslint-disable pure-module/pure-module */
import { cx, style } from "@acalyle/css";
import { theme, varName } from "../theme";

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

export const INPUT_BASE_CLASS_NAME = style({
  padding: "0.25rem 0.75rem",

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

  fontSize: "0.875em",
  lineHeight: "1.25em",
  color: theme("control-text"),
  background: theme("control-bg"),
  outline: "2px solid transparent",
  outlineOffset: "-1px",
  border: `1px solid ${theme("control-outline")}`,
  transition: "0.25s",
  "&:focus-visible": {
    color: theme("control:focus-text"),
    background: theme("control:focus-bg"),
    [varName("control-outline") as "--"]: theme("control:focus-outline"),
    outlineColor: theme("control-outline"),
  },
  // 本来は &[aria-invalid]:not([aria-invalid=""], [aria-invalid="false"])
  '&:user-invalid, &[aria-invalid="true"]': {
    color: theme("control:invalid-text"),
    background: theme("control:invalid-bg"),
    [varName("control-outline") as "--"]: theme("control:invalid-outline"),
  },
});
