import { cx, style } from "@acalyle/css";
import { vars } from "../theme";

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
      borderRadius: `${vars.radius.control} 0 0 ${vars.radius.control}`,
    },
    [`.${group} > &:last-child`]: {
      borderRadius: `0 ${vars.radius.control} ${vars.radius.control} 0`,
    },
    [`.${group} > &:only-child, &`]: {
      borderRadius: vars.radius.control,
    },
  },

  backgroundColor: vars.color.bg.inline,
  border: `1px solid ${vars.color.fg.__}`,
  transition: "0.25s",
  '&:user-invalid, &:user-valid[aria-invalid="true"]': {
    borderColor: vars.color.danger,
  },
  "&:focus-visible": {
    borderColor: "lightgreen",
  },
});
