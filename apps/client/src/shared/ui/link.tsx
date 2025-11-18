import { cx, style } from "@acalyle/css";
import { base, theme } from "@acalyle/ui";
import { type UseLinkPropsOptions, useLinkProps } from "@tanstack/react-router";

export interface LinkProps extends UseLinkPropsOptions {
  target?: React.HTMLAttributeAnchorTarget;
  button?: boolean;
}

export const Link: React.FC<LinkProps> = ({ button, className, ...rest }) => {
  const props = useLinkProps(rest, rest.ref as React.Ref<Element>);

  if ("disabled" in props) delete props.disabled;

  const buttonStyle = style({
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
    "&:not(:any-link)": {
      color: theme("control:disabled-text"),
      background: theme("control:disabled-bg"),
      borderColor: theme("control:disabled-outline"),
      cursor: "not-allowed",
    },
  });

  return (
    <a
      {...props}
      className={cx(
        ":uno: text-inherit not-any-link:text-gray-4",
        button && cx(base, buttonStyle),
        className,
      )}
    >
      {rest.children}
    </a>
  );
};
