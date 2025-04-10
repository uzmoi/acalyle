import { cx, style } from "@acalyle/css";
import { vars } from "../theme";
import { base, reset } from "./base";

export interface SelectProps extends React.ComponentProps<"select"> {
  unstyled?: boolean;
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> & {
  Group: SelectOptionGroupComponent;
  Option: SelectOptionComponent;
} = ({ unstyled, onChange, onValueChange, className, ...restProps }) => {
  const handleChange =
    (onChange ?? onValueChange) &&
    ((e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    });

  return (
    <select
      {...restProps}
      onChange={handleChange}
      className={cx(reset, !unstyled && base, className)}
    />
  );
};

type SelectOptionGroupComponent = React.FC<React.ComponentProps<"optgroup">>;
// eslint-disable-next-line pure-module/pure-module
Select.Group = ({ ...restProps }) => {
  return <optgroup {...restProps} />;
};

if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  Select.Group.displayName = "Select.Group";
}

type SelectOptionComponent = React.FC<React.ComponentProps<"option">>;
// eslint-disable-next-line pure-module/pure-module
Select.Option = ({ className, ...restProps }) => {
  return (
    <option
      {...restProps}
      className={cx(style({ backgroundColor: vars.color.bg.block }), className)}
    />
  );
};

if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  Select.Option.displayName = "Select.Option";
}
