import { cx } from "@acalyle/css";
import { base } from "@acalyle/ui";
import { type UseLinkPropsOptions, useLinkProps } from "@tanstack/react-router";

export interface LinkProps extends UseLinkPropsOptions {
  target?: React.HTMLAttributeAnchorTarget;
  button?: boolean;
}

export const Link: React.FC<LinkProps> = ({ button, className, ...rest }) => {
  const props = useLinkProps(rest, rest.ref as React.Ref<Element>);

  if ("disabled" in props) delete props.disabled;

  return (
    <a {...props} className={cx(button && base, className)}>
      {rest.children}
    </a>
  );
};
