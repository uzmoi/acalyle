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

  borderRadius: vars.radius.control,
  selectors: {
    [`.${group} > & + &`]: { marginLeft: "1px" },
    [`.${group} > &`]: { borderRadius: 0 },
    [`.${group} > &:first-child`]: {
      borderRadius: `${vars.radius.control} 0 0 ${vars.radius.control}`,
    },
    [`.${group} > &:last-child`]: {
      borderRadius: `0 ${vars.radius.control} ${vars.radius.control} 0`,
    },
    [`.${group} > &:only-child`]: {
      borderRadius: vars.radius.control,
    },
  },

  backgroundColor: vars.color.bg.inline,
  borderBottom: `2px solid ${vars.color.fg.__}`,
  transition: "border-bottom-color 400ms",
  "&:focus-visible": {
    borderBottomColor: "lightgreen",
  },
  '&:invalid, &[aria-invalid="true"]': {
    borderBottomColor: vars.color.danger,
  },
});
