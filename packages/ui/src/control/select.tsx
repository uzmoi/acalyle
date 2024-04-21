import { style } from "@macaron-css/core";
import { cx } from "../base/cx";
import { vars } from "../theme";
import { type ControlPartVariant, control } from "./base";

export const Select: React.FC<
    {
        variant?: ControlPartVariant;
        onValueChange?: (value: string) => void;
    } & React.ComponentPropsWithoutRef<"select">
> & {
    Group: SelectOptionGroupComponent;
    Option: SelectOptionComponent;
} = ({
    variant = "outline",
    onChange,
    onValueChange,
    className,
    children,
    ...restProps
}) => {
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
            className={cx(
                control.reset,
                control.base,
                control[variant],
                className,
            )}
        >
            {children}
        </select>
    );
};

type SelectOptionGroupComponent = React.FC<
    React.ComponentPropsWithoutRef<"optgroup">
>;
// eslint-disable-next-line pure-module/pure-module
Select.Group = ({ ...restProps }) => {
    return <optgroup {...restProps} />;
};

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line pure-module/pure-module
    Select.Group.displayName = "Select.Group";
}

type SelectOptionComponent = React.FC<React.ComponentPropsWithoutRef<"option">>;
// eslint-disable-next-line pure-module/pure-module
Select.Option = ({ className, ...restProps }) => {
    return (
        <option
            {...restProps}
            className={cx(
                style({ backgroundColor: vars.color.bg.block }),
                className,
            )}
        />
    );
};

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line pure-module/pure-module
    Select.Option.displayName = "Select.Option";
}
