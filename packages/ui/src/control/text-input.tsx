import { cx } from "../base/cx";
import { type ControlPartVariant, control } from "./base";

// prettier-ignore
type OmitPropNames = (
    // overridden
    | "autoComplete"
    | "autoCapitalize"
    | "autoCorrect"
    | "spellCheck"
    // numeric
    | "min"
    | "max"
    | "step"
    // type="checkbox", type="radio"
    | "checked"
    | "defaultChecked"
    // type="file"
    | "accept"
    | "capture"
    | "multiple"
    // type="image"
    | "src"
    | "alt"
    | "width"
    | "height"
    // type="image", type="submit"
    | "formAction"
    | "formEncType"
    | "formMethod"
    | "formNoValidate"
    | "formTarget"
);

// prettier-ignore
type TextInputType = (
    | "text"
    | "search"
    | "password"
    | "url"
    | "email"
    | "tel"
);

export const TextInput: React.FC<
    {
        type?: TextInputType;
        variant?: ControlPartVariant;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
    } & Omit<React.ComponentPropsWithoutRef<"input">, OmitPropNames>
> = ({
    type = "text",
    variant = "solid",
    onChange,
    onValueChange,
    className,
    ...restProps
}) => {
    const handleChange =
        (onChange ?? onValueChange) &&
        ((e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
        });

    return (
        <input
            {...restProps}
            onChange={handleChange}
            type={type}
            className={cx(
                control.reset,
                control.base,
                control[variant],
                className,
            )}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
        />
    );
};
